---
name: field-encryption-audit
description: Use this skill when testing or verifying field-level AES-256-GCM encryption at rest in PostgreSQL, ensuring task titles, biometric records, and personal data are never stored in plaintext.
---

# Field Encryption Audit Runbook

This runbook guides auditing and testing application-level encryption for sensitive LifeOS data.

## 1. Encryption Specification

- **Algorithm**: AES-256-GCM with PBKDF2/scrypt derived key
- **Storage Format**: `${iv}:${ciphertext}:${authTag}` (all hex strings separated by colons)
  - `iv`: 16 bytes (32 hex characters)
  - `ciphertext`: variable hex string
  - `authTag`: 16 bytes (32 hex characters)
- **Service**: `backend/src/auth/encryption.service.ts`
- **Key Source**: `process.env.ENCRYPTION_KEY`

## 2. Sensitive Fields Inventory

The following database columns **MUST** contain encrypted strings:
- **`Task`**: `title`, `description`, `dueDate`
- **`BiometricLog`**: `source`, `metricType`, `value`
- **`Project`**: `name`, `description`
- **`Context`**: `name`

## 3. Automated Verification Script

A verification script is provided in `./scripts/audit-encryption.js`. Run it via Node in the backend directory:

```bash
node .agents/skills/field-encryption-audit/scripts/audit-encryption.js
```

The script runs a sample encryption/decryption cycle and validates format compliance against the regex:
`^[0-9a-fA-F]{32}:[0-9a-fA-F]+:[0-9a-fA-F]{32}$`

## 4. Manual Database Audit

To inspect raw database rows to confirm no plaintext exists:

```sql
-- Query raw tasks in PostgreSQL
SELECT id, title, description, status FROM "Task" LIMIT 5;

-- Query raw biometric metrics
SELECT id, source, "metricType", value, timestamp FROM "BiometricLog" LIMIT 5;
```

> [!IMPORTANT]
> If any row shows readable text in `title`, `name`, `metricType`, or `value`, it is a critical security bug. All values must match the 3-part hex format.
