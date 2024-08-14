FROM node:lts-buster-slim

WORKDIR /usr/src/app

COPY ../../apps/orchestration /usr/src/app/apps/orchestration
COPY ../../package.json /usr/src/app/package.json
COPY ../../turbo.json /usr/src/app/turbo.json

# Install dependencies
RUN npm install

# Expose ports for both applications
EXPOSE 3002

WORKDIR /usr/src/app/apps/orchestration

CMD ["npm","run","dev"]