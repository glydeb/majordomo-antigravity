import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { WebAuthnService } from './webauthn.service';
import { EncryptionService } from './encryption.service';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, WebAuthnService, EncryptionService],
  exports: [AuthService, EncryptionService],
})
export class AuthModule {}
