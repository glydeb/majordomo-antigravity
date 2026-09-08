---
name: biometric-sync-workflow
description: Use this skill when implementing or testing biometric data ingestion, including Oura Ring API clients, Smart Scale sync, scheduled ingestion jobs, and encrypted storage.
---

# Biometric Ingestion & Sync Runbook

This runbook guides building and testing biometric data pipelines in LifeOS.

## 1. Supported Providers & Metrics

1. **Oura Cloud API**:
   - `SleepScore`: Daily sleep evaluation (0-100).
   - `Readiness`: Physical and mental recovery index (0-100).
   - `ActivityScore`: Daily activity balance.
2. **Smart Scales (Withings / Custom)**:
   - `Weight`: Body weight measurement.
   - `BodyFat`: Percentage.
3. **Manual Entry UI**:
   - Fallback for non-connected metrics or custom notes.

## 2. Ingestion & Encryption Flow

When ingesting biometric logs:
1. Receive raw webhook or scheduled polling payload from external API.
2. Extract metric data points.
3. Pass values through `EncryptionService.encrypt()` before writing to `BiometricLog` table:
   ```typescript
   await prisma.biometricLog.create({
     data: {
       userId: user.id,
       source: encryptionService.encrypt('Oura'),
       metricType: encryptionService.encrypt('Readiness'),
       value: encryptionService.encrypt(JSON.stringify({ score: 85, hrv_balance: 'optimal' })),
       timestamp: new Date(payload.timestamp),
     },
   });
   ```

## 3. Testing with Mock Data

When testing without active cloud credentials, mock API responses should be used:
- Create fixtures matching Oura API v2 schema in `backend/test/fixtures/oura/`.
- Verify sync handlers parse the mock responses and persist encrypted rows properly.
- Run backend unit tests: `npm run test -- biometric`
