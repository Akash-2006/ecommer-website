# E-commerce Application - Docker Setup

A full-stack e-commerce application with Node.js backend and React frontend, containerized with Docker.

## Features

- **Backend**: Node.js + Express API with session-based authentication
- **Frontend**: React + Vite with Nginx for production
- **Database**: JSON file-based storage (no external database required)
- **Authentication**: Session-based authentication (no JWT)
- **Docker**: Complete containerization with multi-stage builds
- **Persistent Storage**: Docker volumes for data and images

## Prerequisites

- Docker (version 20.0 or higher)
- Docker Compose (version 1.28 or higher)

## Quick Start

### Production Mode

1. **Clone the repository and navigate to project directory**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-website
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5000/api/health

### Development Mode

1. **Run in development mode with hot reload**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/health

## Docker Commands

### Production

```bash
# Build and start services
docker-compose up --build -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View development logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Utility Commands

```bash
# Remove all containers and volumes (CAUTION: Data will be lost)
docker-compose down -v

# Clean up Docker system
docker system prune -a

# View running containers
docker ps

# Access backend container shell
docker exec -it ecommerce-backend sh

# Access frontend container shell
docker exec -it ecommerce-frontend sh
```

## Architecture

### Services

1. **Backend Service** (`ecommerce-backend`)
   - Port: 5000
   - Node.js + Express API
   - Session-based authentication
   - JSON file storage in Docker volume

2. **Frontend Service** (`ecommerce-frontend`)
   - Port: 80 (production) / 3000 (development)
   - React + Vite application
   - Nginx reverse proxy (production)

### Volumes

- `backend_data`: Persistent JSON file storage
- `backend_images`: Product images storage

### Network

- `ecommerce-network`: Bridge network for service communication

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/list` - Get featured products

### Orders (Authenticated)
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get single order

### Health Check
- `GET /api/health` - Backend health status

## Environment Variables

### Backend
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `SESSION_SECRET`: Secret key for sessions

### Frontend
- `NODE_ENV`: Environment (development/production)
- `VITE_API_URL`: Backend API URL

## Data Persistence

All application data is stored in Docker volumes:

- **User accounts**: `/app/data/users.json`
- **Products**: `/app/data/products.json`
- **Orders**: `/app/data/orders.json`
- **Images**: `/app/public/images/`

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the port
   lsof -i :80
   lsof -i :5000
   
   # Kill process or change ports in docker-compose.yml
   ```

2. **Permission issues**
   ```bash
   # Fix Docker permissions
   sudo chown -R $USER:$USER /var/run/docker.sock
   ```

3. **Build issues**
   ```bash
   # Clear Docker cache and rebuild
   docker builder prune -a
   docker-compose build --no-cache
   ```

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Container Management

```bash
# Restart specific service
docker-compose restart backend

# Scale services (if needed)
docker-compose up --scale backend=2

# Update services
docker-compose pull
docker-compose up -d
```

## Security Considerations

- Session secrets are configurable via environment variables
- Nginx security headers are configured
- No sensitive data in Docker images
- Volumes for persistent data storage

## Performance Optimization

- Multi-stage Docker builds
- Nginx with gzip compression
- Static asset caching
- Health checks for container monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## License

This project is licensed under the ISC License.
