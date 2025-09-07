#!/bin/bash

# E-commerce Full-Stack Docker Runner Script
# This script builds and runs the complete e-commerce application in a single container

set -e  # Exit on any error

echo "🚀 Starting E-commerce Full-Stack Application with Docker"
echo "=================================================="

# Configuration
IMAGE_NAME="ecommerce-app"
CONTAINER_NAME="ecommerce-fullstack"
HOST_PORT="3000"
CONTAINER_PORT="80"
SESSION_SECRET="${SESSION_SECRET:-production-secret-key-change-this-in-production}"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create data directories if they don't exist
echo "📁 Creating data directories..."
mkdir -p data images

# Copy sample data if directories are empty
if [ ! -f "data/products.json" ] && [ -f "back-end/data/products.json" ]; then
    echo "📋 Copying sample data..."
    cp back-end/data/* data/ 2>/dev/null || true
fi

if [ ! -d "images/products" ] && [ -d "back-end/public/images/products" ]; then
    echo "🖼️  Copying sample images..."
    cp -r back-end/public/images/* images/ 2>/dev/null || true
fi

# Stop and remove existing container if it exists
if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "🛑 Stopping existing container..."
    docker stop ${CONTAINER_NAME} >/dev/null 2>&1 || true
    echo "🗑️  Removing existing container..."
    docker rm ${CONTAINER_NAME} >/dev/null 2>&1 || true
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t ${IMAGE_NAME} .

# Run the container
echo "🐳 Starting container..."
docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${HOST_PORT}:${CONTAINER_PORT} \
    -e NODE_ENV=production \
    -e SESSION_SECRET="${SESSION_SECRET}" \
    -v "$(pwd)/data:/app/backend/data" \
    -v "$(pwd)/images:/app/backend/public/images" \
    --restart unless-stopped \
    ${IMAGE_NAME}

# Wait a moment for the container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check if container is running
if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "✅ Container started successfully!"
    echo ""
    echo "🌐 Application is now running at: http://localhost:${HOST_PORT}"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:     docker logs -f ${CONTAINER_NAME}"
    echo "   Stop app:      docker stop ${CONTAINER_NAME}"
    echo "   Remove app:    docker rm ${CONTAINER_NAME}"
    echo "   Container info: docker inspect ${CONTAINER_NAME}"
    echo ""
    echo "📊 Container status:"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo "❌ Error: Container failed to start. Check logs with:"
    echo "   docker logs ${CONTAINER_NAME}"
    exit 1
fi
