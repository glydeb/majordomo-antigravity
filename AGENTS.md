# LifeOS Project Guidelines & Rules

LifeOS is a privacy-first Progressive Web Application (PWA) integrating Getting Things Done (GTD) task management, biometric data tracking (Oura, Scales), Google Calendar sync, and an AI-driven Assistant.

## Core Architectural Invariants

1. **Security & Field-Level Encryption at Rest**:
   - **Crucial Rule**: All user personal data, task titles, task descriptions, biometric measurements, metric types, project names, and context tags MUST be encrypted with AES-256-GCM prior to being saved to the database.
   - Use `EncryptionService` (`backend/src/auth/encryption.service.ts`) for all encryption and decryption operations.
   - Plaintext personal data or decrypted payloads must NEVER be output in unmasked log streams or error traces.
   - Passkey authentication (`@simplewebauthn`) is the primary authentication path.

2. **Monorepo Structure**:
   - `backend/`: NestJS 11 application with Prisma ORM 6 and PostgreSQL 16 (running via Docker).
   - `frontend/`: React 19 + Vite 5 + Tailwind CSS v4 PWA (`@tailwindcss/vite`, `vite-plugin-pwa`, `framer-motion`).
   - `docker-compose.yml`: Local PostgreSQL container (`lifeos-db`, port 5432).

3. **Development Workflow & Quality Gates**:
   - Maintain strict TypeScript type safety (`strict: true`). Avoid using `any`.
   - Backend changes: Ensure `npm run build` and `npm test` pass in `backend/`.
   - Frontend changes: Ensure `npm run build` passes in `frontend/`.
   - Database migrations: Always use `npx prisma migrate dev` within `backend/`. Do not perform direct manual schema altering without migrations.

4. **Design Aesthetic**:
   - "Premium" aesthetic: Clean dark-mode-first styling, subtle borders, high contrast readability, and smooth Framer Motion micro-interactions.
