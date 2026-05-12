# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем package.json из папки api/
COPY api/package*.json ./

RUN npm ci

# Копируем весь код из api/
COPY api/ .

RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Копируем package.json
COPY api/package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

# Копируем собранный код
COPY --from=builder /app/dist ./dist

# Устанавливаем curl для healthcheck
RUN apk add --no-cache curl

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3000/health || exit 1

COPY .env .env

# Non-root user
USER node

EXPOSE 3000
CMD ["node", "dist/main.js"]