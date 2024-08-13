FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire monorepo into the container
COPY . .

# Install dependencies
RUN npm install

# Generate Prisma client
RUN cd packages/prismaClient && npx prisma generate

# Expose ports for both applications
EXPOSE 4000

WORKDIR /usr/src/app

# Command to start both services
CMD ["npm", "run", "dev"]