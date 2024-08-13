FROM node:20-alpine

WORKDIR /usr/src/app

COPY ../packages /usr/src/app/packages
COPY ../apps/init_service /usr/src/app/apps/init_service

RUN cd packages/prismaClient && npx prisma generate
COPY package.json /usr/src/app/package.json
# COPY pnpm-lock.yaml /usr/src/app/pnpm-lock.yaml
# COPY pnpm-workspace.yaml /usr/src/app/pnpm-workspace.yaml
COPY turbo.json /usr/src/app/turbo.json
COPY tsconfig.json /usr/src/app/tsconfig.json

# Install dependencies
RUN npm install

# Expose ports for both applications
EXPOSE 8000

WORKDIR /usr/src/app/apps/init_service

CMD ["npm","run","dev"]