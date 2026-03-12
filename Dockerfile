# Use a Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY frontend/package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application source code
COPY frontend/ ./

# Build the React frontend application
RUN npm run build

# Stage 2: Serve the application with a lightweight web server (e.g., Nginx or Express.js)
# For this example, we'll use a simple Express.js server as per the tech stack.
# Install Express.js for serving static files
RUN npm install express

# Create a simple server.js file to serve the React build
COPY --dean=root server.js ./

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD [ "node", "server.js" ]
