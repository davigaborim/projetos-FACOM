FROM node:22

WORKDIR /plataforma/server

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
