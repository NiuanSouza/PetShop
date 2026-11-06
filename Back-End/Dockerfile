FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY dist ./dist

ENV PORT=3002
EXPOSE 3002

CMD ["node", "dist/index.js"]
