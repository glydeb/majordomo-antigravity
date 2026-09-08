#!/usr/bin/env node
const crypto = require('crypto');

const key = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef';
const secretKey = crypto.scryptSync(key, 'salt', 32);
const algorithm = 'aes-256-gcm';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

function decrypt(encryptedData) {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = Buffer.from(parts[1], 'hex');
  const authTag = Buffer.from(parts[2], 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText).toString('utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const testPlaintext = 'Confidential GTD Task Title 123';
const encrypted = encrypt(testPlaintext);
const regex = /^[0-9a-fA-F]{32}:[0-9a-fA-F]+:[0-9a-fA-F]{32}$/;

console.log('🧪 Testing AES-256-GCM Encryption Service Logic...');
if (!regex.test(encrypted)) {
  console.error('❌ Failed: Encrypted string does not match expected format.');
  process.exit(1);
}

const decrypted = decrypt(encrypted);
if (decrypted !== testPlaintext) {
  console.error('❌ Failed: Decrypted text does not match original plaintext.');
  process.exit(1);
}

console.log('✅ Success: Format and round-trip verification passed!');
