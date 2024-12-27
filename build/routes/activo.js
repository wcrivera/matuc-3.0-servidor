"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const validar_campos_1 = require("../middlewares/validar-campos");
const activoCtrl = __importStar(require("../controllers/activo"));
const router = (0, express_1.Router)();
// Cliente
router.get("/obtener/:mid", validar_jwt_1.validarJWT, activoCtrl.obtenerActivosModulo);
router.post('/crear/:pid', [
    (0, express_validator_1.check)('gid', 'El id de grupo es obligatorio').notEmpty(),
    (0, express_validator_1.check)('cid', 'El id de curso es obligatorio').notEmpty(),
    (0, express_validator_1.check)('mid', 'El id del módulo es obligatorio').notEmpty(),
    (0, express_validator_1.check)('bid', 'El id del bloque es obligatorio').notEmpty(),
    (0, express_validator_1.check)('sid', 'El id de la sección es obligatorio').notEmpty(),
    validar_campos_1.validarCampos,
    validar_jwt_1.validarJWT
], activoCtrl.crearActivo);
router.put("/editar/:id", validar_jwt_1.validarJWT, activoCtrl.editarActivo);
exports.default = router;
