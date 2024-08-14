FROM node:lts-buster-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire monorepo into the container
COPY ../../packages /usr/src/app/packages
COPY ../../apps/landing /usr/src/app/apps/landing
COPY ../../package.json /usr/src/app/package.json
COPY ../../turbo.json /usr/src/app/turbo.json

# Install dependencies
RUN npm install

# Expose ports for both applications     
EXPOSE 3000

WORKDIR /usr/src/app/apps/landing

# Command to start both services
CMD ["npm", "run", "dev"]