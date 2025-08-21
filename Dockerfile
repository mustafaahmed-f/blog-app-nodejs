FROM node:22.16.0 as base

From base as development

WORKDIR /app
COPY package*.json .
RUN npm install
# Generate Prisma Client inside the container
COPY . .
RUN npx prisma generate
CMD ["npm","run","local:watch"]
EXPOSE 3000

From base as builder

COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate
# Remove dev dependencies to slim the build before copying
RUN npm prune --production

From node:22.16.0-alpine as production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD ["npm","run","prod"]
EXPOSE 5000