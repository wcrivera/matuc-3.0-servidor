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
const cursoCtrl = __importStar(require("../controllers/curso"));
const router = (0, express_1.Router)();
// CLIENTE
router.get("/obtener", validar_jwt_1.validarJWT, cursoCtrl.obtenerCursos);
router.get("/obtener/:cid", validar_jwt_1.validarJWT, cursoCtrl.obtenerCurso);
router.get("/obtener-publico", cursoCtrl.obtenerCursosPublico);
// ADMINISTRADOR
router.get("/admin/obtener", validar_jwt_1.validarAdminJWT, cursoCtrl.obtenerCursos);
router.post("/admin/crear", [
    (0, express_validator_1.check)("sigla", "La sigla del curso es obligatoria").notEmpty(),
    (0, express_validator_1.check)("nombre", "El nombre del curso es obligatorio").notEmpty(),
    (0, express_validator_1.check)("descripcion", "La descripción del curso es obligatorio").notEmpty(),
    validar_campos_1.validarCampos,
    validar_jwt_1.validarAdminJWT,
], cursoCtrl.crearCurso);
router.delete("/admin/eliminar/:cid", validar_jwt_1.validarAdminJWT, cursoCtrl.eliminarCurso);
router.put("/admin/editar/:cid", validar_jwt_1.validarAdminJWT, cursoCtrl.editarCurso);
exports.default = router;
