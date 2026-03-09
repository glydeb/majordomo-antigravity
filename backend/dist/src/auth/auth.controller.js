"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthController = class AuthController {
    authService;
    prisma;
    constructor(authService, prisma) {
        this.authService = authService;
        this.prisma = prisma;
    }
    async getSession(req, res) {
        if (req.session && req.session.userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: req.session.userId },
                select: { id: true, email: true }
            });
            if (user) {
                return res.status(common_1.HttpStatus.OK).json({ user });
            }
        }
        return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ error: 'Not authenticated' });
    }
    async generateRegistration(email, req, res) {
        try {
            if (!email)
                throw new common_1.UnauthorizedException('Email is required');
            const { options, user } = await this.authService.generateRegistration(email);
            req.session.currentChallenge = options.challenge;
            req.session.userId = user.id;
            return res.status(common_1.HttpStatus.OK).json(options);
        }
        catch (e) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: e.message });
        }
    }
    async verifyRegistration(body, req, res) {
        try {
            const expectedChallenge = req.session.currentChallenge;
            if (!expectedChallenge)
                throw new common_1.UnauthorizedException('Registration challenge not found in session');
            const user = await this.prisma.user.findUnique({ where: { id: req.session.userId } });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            const verified = await this.authService.verifyRegistration(user, body, expectedChallenge);
            if (verified) {
                req.session.currentChallenge = undefined;
                req.session.authenticated = true;
                return res.status(common_1.HttpStatus.OK).json({ verified });
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Verification failed' });
            }
        }
        catch (e) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: e.message });
        }
    }
    async generateAuthentication(email, req, res) {
        try {
            if (!email)
                throw new Error('Email is required');
            const { options, user } = await this.authService.generateAuthentication(email);
            req.session.currentChallenge = options.challenge;
            req.session.userId = user.id;
            return res.status(common_1.HttpStatus.OK).json(options);
        }
        catch (e) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: e.message });
        }
    }
    async verifyAuthentication(body, req, res) {
        try {
            const expectedChallenge = req.session.currentChallenge;
            if (!expectedChallenge)
                throw new common_1.UnauthorizedException('Authentication challenge not found in session');
            const user = await this.prisma.user.findUnique({ where: { id: req.session.userId } });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            const verified = await this.authService.verifyAuthentication(user, body, expectedChallenge);
            if (verified) {
                req.session.currentChallenge = undefined;
                req.session.authenticated = true;
                return res.status(common_1.HttpStatus.OK).json({ verified });
            }
            else {
                return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ error: 'Authentication failed' });
            }
        }
        catch (e) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: e.message });
        }
    }
    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Could not log out' });
            }
            res.clearCookie('connect.sid');
            return res.status(common_1.HttpStatus.OK).json({ success: true });
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('session'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('register/generate'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateRegistration", null);
__decorate([
    (0, common_1.Post)('register/verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyRegistration", null);
__decorate([
    (0, common_1.Post)('login/generate'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateAuthentication", null);
__decorate([
    (0, common_1.Post)('login/verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyAuthentication", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        prisma_service_1.PrismaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map