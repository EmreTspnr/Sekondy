FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (must match the PORT environment variable in docker-compose)
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]
