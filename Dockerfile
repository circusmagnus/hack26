# Stage 1: Build the React application
FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY web-checkers/package.json ./web-checkers/package.json
COPY web-checkers/package-lock.json ./web-checkers/package-lock.json

# Install dependencies for the web-checkers directory
RUN npm install --prefix ./web-checkers

# Copy the entire web-checkers directory
COPY web-checkers/ ./web-checkers/

# Build the React application
RUN npm run build --prefix ./web-checkers

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/web-checkers/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
