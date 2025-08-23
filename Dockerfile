FROM node:22.16.0 AS base

FROM base AS development

WORKDIR /app
COPY package*.json .
RUN npm install
# Generate Prisma Client inside the container
COPY . .
RUN npx prisma generate
CMD ["npm","run","local:watch"]
EXPOSE 3000

FROM base AS builder

COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate
# Remove dev dependencies to slim the build before copying
RUN npm prune --production

FROM node:22.16.0-alpine AS production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD ["npm","run","prod"]
EXPOSE 5000