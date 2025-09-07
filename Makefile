# E-commerce Docker Management

.PHONY: help build up down logs clean dev dev-down dev-logs rebuild health

# Default target
help:
	@echo "Available commands:"
	@echo "  build     - Build all services"
	@echo "  up        - Start production services in background"
	@echo "  down      - Stop production services"
	@echo "  logs      - View production logs"
	@echo "  dev       - Start development services"
	@echo "  dev-down  - Stop development services"
	@echo "  dev-logs  - View development logs"
	@echo "  rebuild   - Rebuild and restart services"
	@echo "  health    - Check service health"
	@echo "  clean     - Remove containers, volumes, and images"

# Production commands
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

rebuild: down build up
	@echo "Services rebuilt and restarted"

# Development commands
dev:
	docker-compose -f docker-compose.dev.yml up --build

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Utility commands
health:
	@echo "Checking backend health..."
	@curl -s http://localhost:5000/api/health | jq . || echo "Backend not responding"
	@echo "Checking frontend health..."
	@curl -s http://localhost:80 > /dev/null && echo "Frontend is running" || echo "Frontend not responding"

clean:
	@echo "Warning: This will remove all containers, volumes, and images"
	@echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."
	@sleep 5
	docker-compose down -v
	docker system prune -a -f

# Database/data management
backup-data:
	@mkdir -p backups
	docker cp ecommerce-backend:/app/data ./backups/data-$(shell date +%Y%m%d-%H%M%S)
	@echo "Data backed up to backups/"

restore-data:
	@echo "Available backups:"
	@ls -la backups/
	@echo "To restore: docker cp backups/data-YYYYMMDD-HHMMSS ecommerce-backend:/app/"

# Quick development setup
install: build up
	@echo "Installation complete!"
	@echo "Frontend: http://localhost:80"
	@echo "Backend API: http://localhost:5000/api/health"
