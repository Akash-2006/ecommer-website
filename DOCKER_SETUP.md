# Docker Setup for Full-Stack E-commerce Application

This guide explains how to run the entire e-commerce application (both frontend and backend) in a single Docker container.

## Architecture

The Docker container includes:
- **Backend**: Node.js/Express API server running on port 5000
- **Frontend**: React application built and served by nginx
- **Reverse Proxy**: nginx proxies API requests to the backend and serves static frontend files
- **Process Manager**: Supervisor manages both nginx and Node.js processes

## Quick Start

1. **Build the Docker image:**
   ```bash
   docker build -t ecommerce-app .
   ```

2. **Create data directories (if they don't exist):**
   ```bash
   mkdir -p data images
   ```

3. **Run the container:**
   ```bash
   docker run -d \
     --name ecommerce-fullstack \
     -p 3000:80 \
     -e NODE_ENV=production \
     -e SESSION_SECRET=your-production-secret-key-here \
     -v $(pwd)/data:/app/backend/data \
     -v $(pwd)/images:/app/backend/public/images \
     --restart unless-stopped \
     ecommerce-app
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - All API requests are automatically proxied through nginx

5. **Stop the container:**
   ```bash
   docker stop ecommerce-fullstack
   ```

6. **Remove the container:**
   ```bash
   docker rm ecommerce-fullstack
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node.js environment | `production` |
| `SESSION_SECRET` | Secret key for session security | Must be provided |
| `PORT` | Backend server port | `5000` |

### Volume Mounts

The container uses two volume mounts for data persistence:

- `./data:/app/backend/data` - JSON database files
- `./images:/app/backend/public/images` - Product images

### Ports

- **Port 80** (container) → **Port 3000** (host)
- nginx serves the frontend and proxies API calls to the backend

## Directory Structure

```
/app/
├── backend/           # Node.js backend
│   ├── data/         # JSON database files
│   └── public/images/ # Product images
├── frontend/         # React frontend (source)
└── start.sh          # Startup script
```

## Service Management

The container uses **Supervisor** to manage multiple processes:

- `backend`: Node.js/Express server
- `nginx`: Web server and reverse proxy

### Viewing Logs

```bash
# All logs
docker logs ecommerce-fullstack

# Follow logs in real-time
docker logs -f ecommerce-fullstack

# Backend logs only
docker exec ecommerce-fullstack tail -f /var/log/supervisor/backend.out.log

# nginx logs only
docker exec ecommerce-fullstack tail -f /var/log/supervisor/nginx.out.log
```

## Health Checks

The container includes built-in health checks that verify:
- Frontend is accessible on port 80
- Backend API is responsive on port 5000

Check health status:
```bash
docker ps  # Shows health status
```

## Development vs Production

### Development
For development, continue using the separate frontend and backend servers:
```bash
# Backend
cd back-end && npm run dev

# Frontend (in another terminal)
cd front-end && npm run dev
```

### Production
Use the Docker container for production deployments as it provides:
- Optimized build process
- nginx for efficient static file serving
- Proper process management
- Health monitoring
- Easy scaling and deployment

## Troubleshooting

### Container won't start
1. Check if ports are available: `netstat -tulpn | grep :3000`
2. Verify Docker daemon is running: `docker version`
3. Check build logs: `docker logs ecommerce-fullstack`

### Application not accessible
1. Verify container is running: `docker ps`
2. Check health status: `docker inspect ecommerce-fullstack`
3. Test backend directly: `curl http://localhost:3000/api/health`

### Data not persisting
1. Ensure volume mount directories exist on host
2. Check permissions on mounted directories
3. Verify volume mounts: `docker inspect ecommerce-fullstack`

## Security Notes

1. **Session Secret**: Always change the default `SESSION_SECRET` in production
2. **File Permissions**: Ensure proper permissions on mounted volumes
3. **Network**: The container exposes only port 80; backend port 5000 is internal
4. **Updates**: Regularly update base image and dependencies

## Scaling

For production scaling, consider:
- Load balancer in front of multiple container instances
- External database instead of JSON files
- CDN for static assets
- Container orchestration (Kubernetes, Docker Swarm)
