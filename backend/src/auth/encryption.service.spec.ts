import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service.js';
import { ConfigService } from '@nestjs/config';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-encryption-key-123456789012'),
          },
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encrypt and decrypt', () => {
    it('should correctly round-trip encrypt and decrypt a string', () => {
      const plaintext = 'secret message';
      const ciphertext = service.encrypt(plaintext);
      const decrypted = service.decrypt(ciphertext);
      
      expect(decrypted).toBe(plaintext);
      expect(ciphertext).not.toBe(plaintext);
    });

    it('should output format matching regex ^[0-9a-fA-F]{32}:[0-9a-fA-F]+:[0-9a-fA-F]{32}$', () => {
      const ciphertext = service.encrypt('test');
      const regex = /^[0-9a-fA-F]{32}:[0-9a-fA-F]+:[0-9a-fA-F]{32}$/;
      expect(regex.test(ciphertext)).toBe(true);
    });

    it('should produce different ciphertexts for the same plaintext due to random IV', () => {
      const plaintext = 'same message';
      const cipher1 = service.encrypt(plaintext);
      const cipher2 = service.encrypt(plaintext);
      
      expect(cipher1).not.toBe(cipher2);
      expect(service.decrypt(cipher1)).toBe(plaintext);
      expect(service.decrypt(cipher2)).toBe(plaintext);
    });

    it('should throw error when decrypting malformed input', () => {
      expect(() => service.decrypt('invalid:format')).toThrow();
      expect(() => service.decrypt('invalid')).toThrow();
    });
  });
});
