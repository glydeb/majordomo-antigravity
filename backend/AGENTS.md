# Backend Development Rules (NestJS + Prisma + PostgreSQL)

## Architecture & Design Patterns

1. **NestJS Modular Structure**:
   - Follow NestJS conventions: feature modules should encapsulate their controllers, services, and repository/database interactions.
   - Use Dependency Injection exclusively for service sharing (e.g., inject `PrismaService`, `EncryptionService`, `ConfigService`).
   - Validate incoming payloads using class-validator DTOs or pipes.

2. **Database & Prisma ORM**:
   - Prisma schema is located at `prisma/schema.prisma`.
   - Never alter PostgreSQL schema directly. Run `npx prisma migrate dev --name <migration_name>` to apply schema changes.
   - Run `npx prisma generate` after schema updates.
   - Respect database relationships and cascade delete rules defined in `schema.prisma`.

3. **Encryption Service Protocol**:
   - Sensitive fields in `Task`, `BiometricLog`, `Project`, and `Context` are stored encrypted:
     - Encrypted format: `${iv}:${encryptedData}:${authTag}` (hex-encoded AES-256-GCM).
     - When saving to the database, use `EncryptionService.encrypt(plaintext)`.
     - When returning data to authenticated clients, decrypt using `EncryptionService.decrypt(ciphertext)`.
     - Do not store raw plaintext values in encrypted columns.

4. **WebAuthn / Passkeys**:
   - Authentication relies on `@simplewebauthn/server` and `@simplewebauthn/browser`.
   - Registration options and authentication options must include challenge verification and secure session cookies (`cookie-parser`, `express-session`).

5. **Testing & Code Quality**:
   - Write Jest unit tests for business logic, services, and encryption routines (`npm run test`).
   - Run integration tests with `npm run test:e2e`.
   - Ensure `npm run build` succeeds cleanly without compiler errors before committing.
