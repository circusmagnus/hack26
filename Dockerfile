
# Stage 1: Build the React frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:18-alpine as backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Stage 3: Final image
FROM node:18-alpine
WORKDIR /app

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Copy backend from backend-builder
COPY --from=backend-builder /app/backend ./backend

# Expose port for the backend
EXPOSE 8080

# Set environment variables for MongoDB connection (these should be passed securely in production)
ENV MONGO_URI="mongodb://localhost:27017/tetris"
ENV PORT=8080

# Command to run the backend application
CMD ["node", "backend/server.js"]
