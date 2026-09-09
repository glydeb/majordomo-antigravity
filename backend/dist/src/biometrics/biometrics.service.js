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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
const encryption_service_js_1 = require("../auth/encryption.service.js");
let BiometricsService = class BiometricsService {
    prisma;
    encryptionService;
    constructor(prisma, encryptionService) {
        this.prisma = prisma;
        this.encryptionService = encryptionService;
    }
    decryptLog(log) {
        return {
            ...log,
            source: log.source ? this.encryptionService.decrypt(log.source) : log.source,
            metricType: log.metricType ? this.encryptionService.decrypt(log.metricType) : log.metricType,
            value: log.value ? this.encryptionService.decrypt(log.value) : log.value,
        };
    }
    async create(userId, dto) {
        const data = {
            userId,
            timestamp: new Date(dto.timestamp)
        };
        if (dto.source)
            data.source = this.encryptionService.encrypt(dto.source);
        if (dto.metricType)
            data.metricType = this.encryptionService.encrypt(dto.metricType);
        if (dto.value)
            data.value = this.encryptionService.encrypt(dto.value);
        const log = await this.prisma.biometricLog.create({ data });
        return this.decryptLog(log);
    }
    async findAllForUser(userId, filters) {
        const logs = await this.prisma.biometricLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' }
        });
        let decryptedLogs = logs.map(l => this.decryptLog(l));
        if (filters?.metricType) {
            decryptedLogs = decryptedLogs.filter(l => l.metricType === filters.metricType);
        }
        if (filters?.source) {
            decryptedLogs = decryptedLogs.filter(l => l.source === filters.source);
        }
        return decryptedLogs;
    }
    async findOne(id, userId) {
        const log = await this.prisma.biometricLog.findUnique({
            where: { id }
        });
        if (!log || log.userId !== userId) {
            throw new common_1.NotFoundException('Biometric log not found');
        }
        return this.decryptLog(log);
    }
    async remove(id, userId) {
        const log = await this.prisma.biometricLog.findUnique({ where: { id } });
        if (!log || log.userId !== userId) {
            throw new common_1.NotFoundException('Biometric log not found');
        }
        await this.prisma.biometricLog.delete({ where: { id } });
        return { success: true };
    }
};
exports.BiometricsService = BiometricsService;
exports.BiometricsService = BiometricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        encryption_service_js_1.EncryptionService])
], BiometricsService);
//# sourceMappingURL=biometrics.service.js.map