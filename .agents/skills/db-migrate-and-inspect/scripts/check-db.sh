#!/usr/bin/env bash
set -e

echo "🔍 Checking PostgreSQL container status..."
if command -v docker >/dev/null 2>&1; then
  if docker ps --format '{{.Names}}' | grep -q "lifeos-db"; then
    echo "✅ Container 'lifeos-db' is running."
    docker exec lifeos-db pg_isready -U lifeos -d lifeos_db
  else
    echo "⚠️ Container 'lifeos-db' is not running. Start with: docker compose up -d postgres"
    exit 1
  fi
else
  echo "⚠️ Docker is not available in current environment."
  exit 1
fi
