.PHONY: all build docker-up docker-down test clean dev logs

# Variables
PROJECT_NAME=cloud_storage
DOCKER_COMPOSE=docker compose
API_DIR=api

all: docker-up

# Build project
build:
	@echo "Building API..."
	cd $(API_DIR) && npm run build
	@echo "Build complete."

# Build Docker images
docker-build: build
	@echo "Building Docker images..."
	@$(DOCKER_COMPOSE) build
	@echo "Docker images built."

# Start services with Docker Compose
docker-up: docker-build
	@echo "Starting services with Docker Compose..."
	@$(DOCKER_COMPOSE) up -d
	@echo "Started api at http://localhost:3000"

dev:
	@echo "Starting in dev mode..."
	docker compose up postgres redis minio -d && cd $(API_DIR) && npm run start:dev
	@echo "Started API in dev mode at http://localhost:3000"

# Stop Docker Compose
docker-down:
	@echo "Stopping services..."
	@$(DOCKER_COMPOSE) down
	@echo "Stopped"

# View logs
logs:
	@$(DOCKER_COMPOSE) logs -f api

# Run tests
test:
	cd $(API_DIR) && npm run test

# Clean
clean:
	@echo "Cleaning..."
	$(DOCKER_COMPOSE) down -v
	cd $(API_DIR) && rm -rf dist/ node_modules/.cache/
	docker system prune -f

# Migrate DB
migrate:
	cd $(API_DIR) && npm run typeorm migration:run

# Help
help:
	@echo "Available targets:"
	@echo "  make build        - Build api server"
	@echo "  make docker-build - Build Docker images"
	@echo "  make docker-up    - Start services with Docker Compose"
	@echo "  make dev          - Start services with Docker Compose in dev mode"
	@echo "  make docker-down  - Stop services"
	@echo "  make logs         - Show api logs"
	@echo "  make test         - Run tests"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make migrate      - Migrate DB"
	@echo "  make help         - Show help"