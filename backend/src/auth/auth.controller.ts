import { Controller, Post, Body, Req, Res, HttpStatus, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('session')
  async getSession(@Req() req: any, @Res() res: Response) {
    if (req.session && req.session.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: req.session.userId },
        select: { id: true, email: true }
      });
      if (user) {
        return res.status(HttpStatus.OK).json({ user });
      }
    }
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Not authenticated' });
  }

  @Post('register/generate')
  async generateRegistration(@Body('email') email: string, @Req() req: any, @Res() res: Response) {
    try {
      if (!email) throw new UnauthorizedException('Email is required');
      const { options, user } = await this.authService.generateRegistration(email);
      req.session.currentChallenge = options.challenge;
      req.session.userId = user.id;
      return res.status(HttpStatus.OK).json(options);
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message });
    }
  }

  @Post('register/verify')
  async verifyRegistration(@Body() body: any, @Req() req: any, @Res() res: Response) {
    try {
      const expectedChallenge = req.session.currentChallenge;
      if (!expectedChallenge) throw new UnauthorizedException('Registration challenge not found in session');

      const user = await this.prisma.user.findUnique({ where: { id: req.session.userId } });
      if (!user) throw new UnauthorizedException('User not found');

      const verified = await this.authService.verifyRegistration(user, body, expectedChallenge);
      
      if (verified) {
        req.session.currentChallenge = undefined;
        req.session.authenticated = true;
        return res.status(HttpStatus.OK).json({ verified });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Verification failed' });
      }
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message });
    }
  }

  @Post('login/generate')
  async generateAuthentication(@Body('email') email: string, @Req() req: any, @Res() res: Response) {
    try {
      if (!email) throw new Error('Email is required');
      const { options, user } = await this.authService.generateAuthentication(email);
      req.session.currentChallenge = options.challenge;
      req.session.userId = user.id;
      return res.status(HttpStatus.OK).json(options);
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message });
    }
  }

  @Post('login/verify')
  async verifyAuthentication(@Body() body: any, @Req() req: any, @Res() res: Response) {
    try {
      const expectedChallenge = req.session.currentChallenge;
      if (!expectedChallenge) throw new UnauthorizedException('Authentication challenge not found in session');

      const user = await this.prisma.user.findUnique({ where: { id: req.session.userId } });
      if (!user) throw new UnauthorizedException('User not found');

      const verified = await this.authService.verifyAuthentication(user, body, expectedChallenge);

      if (verified) {
        req.session.currentChallenge = undefined;
        req.session.authenticated = true;
        return res.status(HttpStatus.OK).json({ verified });
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Authentication failed' });
      }
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message });
    }
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Could not log out' });
      }
      res.clearCookie('connect.sid');
      return res.status(HttpStatus.OK).json({ success: true });
    });
  }
}
