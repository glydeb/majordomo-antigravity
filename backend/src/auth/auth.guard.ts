import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const session = request.session as any;
    
    if (session && session.authenticated === true && session.userId) {
      return true;
    }
    
    throw new UnauthorizedException('User is not authenticated');
  }
}
