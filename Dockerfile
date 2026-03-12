# Use a lightweight Nginx image
FROM nginx:alpine

# Copy static files to the Nginx html directory
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/

# Optional: Change Nginx to listen on port 8080 (Cloud Run's default)
# if you want to use Cloud Run's default port configuration without overrides.
# If you leave it as 80, you must deploy using: gcloud run deploy --port 80
RUN sed -i 's/listen \(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Expose the port
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
