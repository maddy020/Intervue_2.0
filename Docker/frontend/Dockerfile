FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire monorepo into the container
COPY ../packages /usr/src/app/packages
COPY ../apps/frontend /usr/src/app/apps/frontend
COPY package.json /usr/src/app/package.json
# COPY pnpm-lock.yaml /usr/src/app/pnpm-lock.yaml
# COPY pnpm-workspace.yaml /usr/src/app/pnpm-workspace.yaml
COPY turbo.json /usr/src/app/turbo.json
COPY tsconfig.json /usr/src/app/tsconfig.json


# Install dependencies
RUN npm install

# Expose ports for both applications     
EXPOSE 5173

WORKDIR /usr/src/app/apps/frontend

# Command to start both services
CMD ["npm", "run", "dev"]