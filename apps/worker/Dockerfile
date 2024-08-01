FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --save-dev typescript 

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm" , "run" , "dev"]