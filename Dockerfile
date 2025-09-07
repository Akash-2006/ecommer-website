# Single Docker Container for Full-Stack E-commerce App
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install nginx for serving frontend
RUN apk add --no-cache nginx supervisor curl

# Create necessary directories
RUN mkdir -p /app/backend /app/frontend /var/log/supervisor /run/nginx /etc/supervisor/conf.d

# Copy backend files
COPY back-end /app/backend
WORKDIR /app/backend

# Install backend dependencies and create data directories
RUN npm ci --only=production && \
    mkdir -p data public/images/products

# Copy products data and images
COPY back-end/data/products.json /app/backend/data/products.json
COPY images/products/ /app/backend/public/images/products/

# Build and prepare frontend
WORKDIR /app
COPY front-end /app/frontend
WORKDIR /app/frontend

# Install frontend dependencies and build
RUN npm ci && npm run build

# Copy built frontend to nginx directory
RUN cp -r dist/* /var/www/html/ 2>/dev/null || \
    (mkdir -p /var/www/html && cp -r dist/* /var/www/html/)

# Copy configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Ensure directories exist' >> /app/start.sh && \
    echo 'mkdir -p /var/www/html /var/log/nginx /var/log/supervisor /run/nginx' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Copy frontend files if they do not exist' >> /app/start.sh && \
    echo 'if [ ! -f /var/www/html/index.html ]; then' >> /app/start.sh && \
    echo '    cp -r /app/frontend/dist/* /var/www/html/' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start supervisor to manage both services' >> /app/start.sh && \
    echo 'exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf' >> /app/start.sh

RUN chmod +x /app/start.sh

# Set working directory back to app root
WORKDIR /app

# Expose port 80 (nginx will serve both frontend and proxy backend)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:80 && curl -f http://localhost:5000/api/health || exit 1

# Start both services
CMD ["/app/start.sh"]
