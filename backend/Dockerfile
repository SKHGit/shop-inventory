# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Your app binds to port 5000, so you'll use the -p flag to map it
EXPOSE 5000

# Define the command to run your app
CMD [ "npm", "start" ]
