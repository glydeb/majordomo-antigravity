---
name: db-migrate-and-inspect
description: Use this skill when managing the PostgreSQL database, executing Prisma migrations, inspecting database schema, checking Docker PostgreSQL container health, or seeding development data in LifeOS.
---

# Database Migration & Inspection Runbook

This runbook guides managing the PostgreSQL database service and Prisma ORM for LifeOS.

## 1. Database Liveness & Connection

The PostgreSQL service runs via Docker Compose defined in `docker-compose.yml`:
- Container: `lifeos-db`
- Database: `lifeos_db`
- User: `lifeos`
- Port: `5432`

To verify container status and connectivity:
```bash
# Check if container is running
docker compose ps

# Start database if stopped
docker compose up -d postgres

# Run connectivity test script
./scripts/check-db.sh
```

## 2. Prisma Migrations

Always run migration commands from the `backend/` directory:

```bash
cd backend

# Create and apply a new migration after editing schema.prisma
npx prisma migrate dev --name <migration_description>

# Generate Prisma Client after schema changes
npx prisma generate

# Inspect status of applied migrations
npx prisma migrate status
```

> [!CAUTION]
> Never run `prisma migrate reset` without explicit user permission, as it drops all existing tables and data.

## 3. Database Introspection & Studio

To inspect database records visually or through CLI:
```bash
cd backend
npx prisma studio --port 5555
```
Or use the configured PostgreSQL MCP server to inspect tables directly.
