FROM node:20-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/generated ./generated

EXPOSE 3000

CMD ["node", "dist/main"]
