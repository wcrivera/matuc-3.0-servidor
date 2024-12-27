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
const bloqueCtrl = __importStar(require("../controllers/bloque"));
const router = (0, express_1.Router)();
// Cliente
router.get("/obtener/:mid", validar_jwt_1.validarJWT, bloqueCtrl.obtenerBloquesModulo);
router.get("/obtener-publico/:cid", bloqueCtrl.obtenerBloquesCursoPublico);
// Admin
router.get("/admin/obtener/:mid", validar_jwt_1.validarAdminJWT, bloqueCtrl.obtenerBloquesModulo);
router.post("/admin/crear", [
    (0, express_validator_1.check)("cid", "El id del curso es obligatorio").notEmpty(),
    (0, express_validator_1.check)("mid", "El id del modulo es obligatorio").notEmpty(),
    (0, express_validator_1.check)("bloque", "El bloque del modulo es obligatorio").notEmpty(),
    (0, express_validator_1.check)("nombre", "El nombre del modulo es obligatorio").notEmpty(),
    validar_campos_1.validarCampos,
    validar_jwt_1.validarAdminJWT,
], bloqueCtrl.crearBloque);
router.delete("/admin/eliminar/:bid", validar_jwt_1.validarAdminJWT, bloqueCtrl.eliminarBloque);
router.put("/admin/editar/:bid", validar_jwt_1.validarAdminJWT, bloqueCtrl.editarBloque);
exports.default = router;
