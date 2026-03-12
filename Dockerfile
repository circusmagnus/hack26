# Use a lightweight Nginx image
FROM nginx:alpine

# Copy only the necessary static files to the Nginx html directory
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/

# Expose port 80 - Nginx listens on this by default
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
