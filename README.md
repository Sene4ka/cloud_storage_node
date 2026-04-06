# cloud_storage_node
Simple cloud storage backend realisation

**Stack**:
- Node.js (Nest.js)
- PgSQL
- Redis
- MinIO

**Deploy**:
- Docker, Docker Compose

## **Starting API on Your Machine Tutorial**

```bash
# 1. Clone + setup
git clone https://github.com/Sene4ka/cloud_storage_node.git
cd cloud_storage_node

# 2. Environment
cp .env.example .env
# Set your desired env values for docker compose

# 3. Start the server
make docker-up 
# Automatically Executes 'make build' and make 'docker-build' before starting API with 'docker compose'

# 4. For more options
make help