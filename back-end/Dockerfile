# Use official Node.js runtime as base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create data directory for JSON files
RUN mkdir -p data

# Create directories for static files
RUN mkdir -p public/images/products

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run the application
CMD ["npm", "start"]
