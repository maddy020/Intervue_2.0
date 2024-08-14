FROM node:lts-buster-slim

# Set the working directory in the container
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
ENV PYTHON=/usr/bin/python3

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install root dependencies
RUN npm install

# Copy all other necessary files
COPY . .

# Install additional dependencies specific to subprojects
RUN cd apps/init_service && npm install --save-exact --save-dev esbuild
RUN cd apps/orchestration && npm install -g typescript 

# Generate Prisma Client
RUN cd packages/prismaClient && npx prisma generate

# Ensure all binaries are accessible in PATH
RUN npm install

CMD ["npm", "run", "dev:docker"]
