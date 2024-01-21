FROM node:latest

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm i -g jest-cli

# Bundle app source
COPY . .

# Keep container running
CMD tail -f /dev/null
