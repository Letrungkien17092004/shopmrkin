FROM node:24-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --ignore-scripts
COPY . .
RUN npx prisma generate --schema=./src/services/postgresSQL/prisma/schema.prisma
EXPOSE 8000
CMD ["npm", "run", "dev"]