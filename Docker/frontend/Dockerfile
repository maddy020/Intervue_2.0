FROM node:lts-buster-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire monorepo into the container
COPY ../../packages /usr/src/app/packages
COPY ../../apps/frontend /usr/src/app/apps/frontend
COPY ../../package.json /usr/src/app/package.json
COPY ../../turbo.json /usr/src/app/turbo.json

# Install dependencies
RUN npm install

# Expose ports for both applications     
EXPOSE 5173

WORKDIR /usr/src/app/apps/frontend

# Command to start both services
CMD ["npm", "run", "dev"]