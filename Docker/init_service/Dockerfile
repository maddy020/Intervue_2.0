FROM node:lts-buster-slim

WORKDIR /usr/src/app

COPY ../../packages /usr/src/app/packages
COPY ../../apps/init_service /usr/src/app/apps/init_service

RUN cd packages/prismaClient && npx prisma generate

COPY ../../package.json /usr/src/app/package.json
COPY ../../turbo.json /usr/src/app/turbo.json

# Install dependencies
RUN npm install

# Expose ports for both applications
EXPOSE 8000

WORKDIR /usr/src/app/apps/init_service

CMD ["npm","run","dev"]