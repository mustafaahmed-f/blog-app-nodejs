FROM node:22.16.0 AS base

FROM base AS development

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g prisma@6.14.0
# Generate Prisma Client inside the container
COPY . ./
RUN npx prisma generate
CMD ["npm","run","local:watch"]
EXPOSE 5001

FROM node:22.16.0-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . ./
RUN npx prisma generate

# Increase Node memory limit to 4 GB during build
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Remove dev dependencies to slim the build before copying
RUN npm prune --production

FROM node:22.16.0-alpine AS production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

CMD ["npm","run","prod"]
EXPOSE 5001