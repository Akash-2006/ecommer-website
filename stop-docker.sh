#!/bin/bash

# E-commerce Full-Stack Docker Stop Script
# This script stops and optionally removes the Docker container

set -e  # Exit on any error

echo "🛑 Stopping E-commerce Full-Stack Application"
echo "============================================="

# Configuration
CONTAINER_NAME="ecommerce-fullstack"

# Check if container exists
if ! docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "ℹ️  Container '${CONTAINER_NAME}' does not exist."
    exit 0
fi

# Check if container is running
if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "🛑 Stopping container..."
    docker stop ${CONTAINER_NAME}
    echo "✅ Container stopped successfully."
else
    echo "ℹ️  Container is already stopped."
fi

# Ask if user wants to remove the container
read -p "Do you want to remove the container? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing container..."
    docker rm ${CONTAINER_NAME}
    echo "✅ Container removed successfully."
else
    echo "ℹ️  Container kept (stopped). Use 'docker start ${CONTAINER_NAME}' to restart."
fi

echo "🏁 Done!"
