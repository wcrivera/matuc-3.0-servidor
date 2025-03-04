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
const usuarioCtrl = __importStar(require("../controllers/usuario"));
const validar_jwt_1 = require("../middlewares/validar-jwt");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const validar_google_token_1 = require("../middlewares/validar-google-token");
const router = (0, express_1.Router)();
// CLIENTE
router.post("/outlook", usuarioCtrl.loginOutlook);
router.post("/login", usuarioCtrl.login);
router.post('/google', validar_google_token_1.validarGoogleToken, usuarioCtrl.loginGoogle);
router.get("/renew", validar_jwt_1.validarJWT, usuarioCtrl.renewToken);
router.post('/pimu', validar_jwt_1.validarPJWT, usuarioCtrl.loginPIMU);
router.put("/editar/:uid", usuarioCtrl.editarUsuario);
// ADMINISTRADOR
router.post("/admin/outlook", usuarioCtrl.loginOutlookAdmin);
router.get("/admin/obtener/:gid", validar_jwt_1.validarAdminJWT, usuarioCtrl.obtenerUsuariosGrupo);
router.get("/admin/obtener-no-matriculado/:gid", validar_jwt_1.validarAdminJWT, usuarioCtrl.obtenerUsuariosNoMatriculados);
router.post("/admin/crear/password", [
    (0, express_validator_1.check)("nombre", "El nombre es obligatorio").notEmpty(),
    (0, express_validator_1.check)("apellido", "El apellido es obligatorio").notEmpty(),
    (0, express_validator_1.check)("email", "El email es obligatorio").notEmpty(),
    (0, express_validator_1.check)("password", "El password es obligatorio").notEmpty(),
    validar_campos_1.validarCampos,
    validar_jwt_1.validarAdminJWT,
], usuarioCtrl.crearUsuarioPassword);
router.post("/admin/crear", [
    (0, express_validator_1.check)("nombre", "El nombre es obligatorio").notEmpty(),
    (0, express_validator_1.check)("apellido", "El apellido es obligatorio").notEmpty(),
    (0, express_validator_1.check)("email", "El email es obligatorio").notEmpty(),
    validar_campos_1.validarCampos,
    validar_jwt_1.validarAdminJWT,
], usuarioCtrl.crearUsuario);
router.delete("/admin/eliminar/:id", validar_jwt_1.validarAdminJWT, usuarioCtrl.eliminarUsuario);
router.put("/admin/editar/:uid", validar_jwt_1.validarAdminJWT, usuarioCtrl.editarUsuario);
exports.default = router;
