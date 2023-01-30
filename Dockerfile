FROM node:18
EXPOSE 3000
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD [ "npm", "run", "docker:deploy" ]
