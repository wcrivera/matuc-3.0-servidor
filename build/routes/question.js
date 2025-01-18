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
const questionCtrl = __importStar(require("../controllers/question"));
const router = (0, express_1.Router)();
// Cliente
router.get("/obtener/:mid", validar_jwt_1.validarJWT, questionCtrl.obtenerQuestionsModulo);
router.get("/obtener/seccion/:qid", validar_jwt_1.validarJWT, questionCtrl.obtenerQuestionSeccion);
router.get("/obtener/questions/seccion/:sid", validar_jwt_1.validarJWT, questionCtrl.obtenerQuestionsSeccion);
// Admin
router.get("/admin/obtener/:mid", validar_jwt_1.validarAdminJWT, questionCtrl.obtenerQuestionsModulo);
router.post("/admin/crear", [
    (0, express_validator_1.check)("cid", "El id del curso es obligatorio").notEmpty(),
    (0, express_validator_1.check)("mid", "El id del módulo es obligatorio").notEmpty(),
    (0, express_validator_1.check)("bid", "El id del bloque es obligatorio").notEmpty(),
    (0, express_validator_1.check)("sid", "El id de la sección es obligatorio").notEmpty(),
    (0, express_validator_1.check)("numero", "El número es obligatorio").notEmpty(),
    validar_campos_1.validarCampos,
    validar_jwt_1.validarAdminJWT,
], questionCtrl.crearQuestion);
router.delete("/admin/eliminar/:qid", validar_jwt_1.validarAdminJWT, questionCtrl.eliminarQuestion);
router.put("/admin/editar/:qid", validar_jwt_1.validarAdminJWT, questionCtrl.editarQuestion);
exports.default = router;
