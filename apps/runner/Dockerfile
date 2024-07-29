# Use the official Node.js 20-buster image as the base image
FROM node:20-buster

# Set the working directory inside the container
WORKDIR /app

# Install Python, make, and g++
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package.json to the working directory
COPY package.json ./

# Set the PYTHON environment variable
ENV PYTHON=/usr/bin/python3

# Install dependencies, including TypeScript
RUN npm install typescript --save-dev

RUN npm install aws-sdk

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 3006

# Define the command to run the application
CMD ["npm", "run" ,"dev"]
