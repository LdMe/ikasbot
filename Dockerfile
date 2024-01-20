FROM docker:dind

# Create app directory
WORKDIR /app

# Install latest node version
RUN apk add --update nodejs npm


# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port ${APP_PORT}
ARG APP_PORT
EXPOSE ${APP_PORT}

# Run the app
CMD [ "npm", "run", "dev" ]
