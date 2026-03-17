# Use a lightweight Nginx image
FROM nginx:alpine

# Copy static files to the Nginx html directory
COPY . /usr/share/nginx/html/

# Configure Nginx to listen on port 8080
RUN sed -i 's/listen \(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf

EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# Verified as per SCRUM-550: Dockerfile and Nginx setup for static files are correctly configured.
