import { AuthService } from './auth.service';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthController {
    private readonly authService;
    private readonly prisma;
    constructor(authService: AuthService, prisma: PrismaService);
    getSession(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    generateRegistration(email: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyRegistration(body: any, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    generateAuthentication(email: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyAuthentication(body: any, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: any, res: Response): Promise<void>;
}
