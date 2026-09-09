"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricsModule = void 0;
const common_1 = require("@nestjs/common");
const biometrics_service_js_1 = require("./biometrics.service.js");
const biometrics_controller_js_1 = require("./biometrics.controller.js");
const prisma_module_js_1 = require("../prisma/prisma.module.js");
const auth_module_js_1 = require("../auth/auth.module.js");
let BiometricsModule = class BiometricsModule {
};
exports.BiometricsModule = BiometricsModule;
exports.BiometricsModule = BiometricsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_js_1.PrismaModule, auth_module_js_1.AuthModule],
        controllers: [biometrics_controller_js_1.BiometricsController],
        providers: [biometrics_service_js_1.BiometricsService],
    })
], BiometricsModule);
//# sourceMappingURL=biometrics.module.js.map