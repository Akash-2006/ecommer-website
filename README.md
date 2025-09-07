# E-commerce Website - How to Run

A full-stack e-commerce application with React frontend, Node.js backend, and Docker deployment.

## 📋 Table of Contents
- [Quick Start (Docker - Recommended)](#-quick-start-docker---recommended)
- [Development Setup](#-development-setup)
- [Manual Setup](#-manual-setup)
- [Available Commands](#-available-commands)
- [Product Images](#-product-images)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
- Docker Desktop installed and running
- Git

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd ecommerce/website
```

### 2. Start the Application
```bash
# Make the run script executable
chmod +x run-docker.sh

# Start the full application (frontend + backend + nginx)
./run-docker.sh
```

### 3. Access the Application
- **Website**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

### 4. Stop the Application
```bash
# Stop the container
docker stop ecommerce-fullstack

# Remove the container
docker rm ecommerce-fullstack

# Or use the stop script
./stop-docker.sh
```

## 💻 Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd ecommerce/website
```

### 2. Install Dependencies

**Frontend:**
```bash
cd front-end
npm install
```

**Backend:**
```bash
cd ../back-end
npm install
```

### 3. Environment Setup

**Backend (.env):**
```bash
cd back-end
# Create .env file
echo "PORT=5000" > .env
echo "NODE_ENV=development" >> .env
echo "SESSION_SECRET=your-session-secret-key-here" >> .env
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd back-end
npm run dev
# Backend will run on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd front-end
npm run dev
# Frontend will run on http://localhost:5173
```

### 5. Access Development Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Products**: http://localhost:5000/api/products

## 🛠 Manual Setup

### 1. Build Frontend for Production
```bash
cd front-end
npm run build
```

### 2. Start Backend Only
```bash
cd back-end
npm start
# or for development with hot reload
npm run dev
```

### 3. Serve Frontend (Static Files)
```bash
# Using a simple HTTP server
cd front-end/dist
python3 -m http.server 3000
# or
npx serve -s . -l 3000
```

## 📝 Available Commands

### Docker Commands
```bash
# Start application
./run-docker.sh

# Stop application
./stop-docker.sh

# View container logs
docker logs -f ecommerce-fullstack

# Check container status
docker ps

# Access container shell
docker exec -it ecommerce-fullstack sh

# Restart container
docker restart ecommerce-fullstack
```

### Frontend Commands
```bash
cd front-end

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Commands
```bash
cd back-end

# Install dependencies
npm install

# Start production server
npm start

# Start development server (with nodemon)
npm run dev

# Run tests (if available)
npm test
```

## 🖼 Product Images

The application includes **150+ product placeholders**. To generate/update images:

### Generate Professional Placeholders
```bash
# Generate matching placeholders for all products
python3 create_matching_placeholders.py

# Generate simple placeholders
python3 generate_placeholders.py
```

### Download Real Product Images
```bash
# Download targeted fashion images
python3 download_targeted_images.py

# Download with advanced matching
python3 download_images_advanced.py
```

### Manual Image Management
```bash
# Check current images
ls -la images/products/

# Image requirements:
# - Format: JPEG (.jpg)
# - Size: 500x500 pixels recommended
# - Location: images/products/
# - Naming: Must match filenames in products.json
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/gender/:gender` - Get products by gender
- `GET /api/products/filters/colors` - Get available colors
- `GET /api/products/filters/sizes` - Get available sizes
- `GET /api/products/featured/list` - Get featured products

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

### Users
- `PUT /api/users/profile` - Update user profile

### Health Check
- `GET /api/health` - API health status

## 🔧 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

**2. Docker Container Won't Start**
```bash
# Check Docker logs
docker logs ecommerce-fullstack

# Restart Docker Desktop
# Then try running the application again
```

**3. Images Not Loading**
```bash
# Restart the container
docker restart ecommerce-fullstack

# Check if images exist
docker exec ecommerce-fullstack ls /app/backend/public/images/products/

# Regenerate images
python3 create_matching_placeholders.py
docker restart ecommerce-fullstack
```

**4. Frontend Build Issues**
```bash
cd front-end

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

**5. Backend API Issues**
```bash
cd back-end

# Check if products.json exists
ls -la data/

# Restart backend
npm run dev

# Check API health
curl http://localhost:5000/api/health
```

**6. Permission Issues (macOS/Linux)**
```bash
# Fix script permissions
chmod +x run-docker.sh
chmod +x stop-docker.sh
chmod +x create_matching_placeholders.py
```

### Development vs Production

**Development (Recommended for coding):**
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:5000 (Direct Node.js)
- Hot reload enabled
- Source maps available

**Docker (Recommended for testing):**
- Full application: http://localhost:3000
- Production-like environment
- Nginx reverse proxy
- Single container deployment

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-secret-key-here
```

**Frontend:**
- No environment variables required
- API URL is automatically configured

## 📊 Application Features

✅ **150+ Products** with categories and filtering  
✅ **Responsive Design** - Mobile, tablet, desktop  
✅ **Product Search & Filter** - By category, gender, price, color, size  
✅ **Shopping Cart** - Add, remove, update quantities  
✅ **User Authentication** - Register, login, logout  
✅ **Order Management** - Place orders, view history  
✅ **Professional Images** - Category-specific placeholders  
✅ **Docker Deployment** - Single command deployment  

## 🚀 Quick Commands Summary

```bash
# Start everything with Docker (easiest)
./run-docker.sh

# Visit your website
open http://localhost:3000

# Stop when done
./stop-docker.sh

# For development
cd front-end && npm run dev    # Terminal 1
cd back-end && npm run dev     # Terminal 2
```

## 💡 Tips

- Use Docker for quick setup and testing
- Use development setup for active coding
- Check logs if something isn't working: `docker logs ecommerce-fullstack`
- Regenerate images if they're not showing: `python3 create_matching_placeholders.py`
- The application includes sample products and categories out of the box

---

**🎉 Your e-commerce website is ready to go!**  
Visit http://localhost:3000 after running the Docker command.
