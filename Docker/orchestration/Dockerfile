FROM node:20-alpine

WORKDIR /usr/src/app

COPY ../apps/orchestration /usr/src/app/apps/orchestration
COPY package.json /usr/src/app/package.json
# COPY pnpm-lock.yaml /usr/src/app/pnpm-lock.yaml
# COPY pnpm-workspace.yaml /usr/src/app/pnpm-workspace.yaml
COPY turbo.json /usr/src/app/turbo.json
COPY tsconfig.json /usr/src/app/tsconfig.json

# Install dependencies
RUN npm install

# Expose ports for both applications
EXPOSE 3002

WORKDIR /usr/src/app/apps/orchestration

CMD ["npm","run","dev"]