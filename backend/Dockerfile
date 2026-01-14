FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

FROM base AS dependencies

RUN npm ci --only=production

FROM base AS build

RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]