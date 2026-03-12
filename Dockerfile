# Use a lightweight Nginx image
FROM nginx:alpine

# Copy static files from the 'app' directory to the Nginx html directory
COPY app /usr/share/nginx/html/

RUN sed -i 's/listen \(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf

EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
