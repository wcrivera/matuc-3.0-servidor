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
const dbqCtrl = __importStar(require("../controllers/dbq"));
const router = (0, express_1.Router)();
// Cliente
router.get('/obtener/:mid', validar_jwt_1.validarJWT, dbqCtrl.obtenerDBQSModulo);
router.get('/obtener/question/:qid', validar_jwt_1.validarJWT, dbqCtrl.obtenerDBQQuestion);
router.post('/crear/:pid', [
    (0, express_validator_1.check)('cid', 'El id de curso es obligatorio').notEmpty(),
    (0, express_validator_1.check)('mid', 'El id del módulo es obligatorio').notEmpty(),
    (0, express_validator_1.check)('pid', 'El id de la pregunta es obligatorio').notEmpty(),
    (0, express_validator_1.check)('respuesta', 'La respuesta de la pregunta es obligatoria').notEmpty(),
    (0, express_validator_1.check)('estado', 'El estado de la pregunta es obligatorio').notEmpty(),
    validar_campos_1.validarCampos,
    validar_jwt_1.validarJWT
], dbqCtrl.crearDBQ);
// router.get('/obtener/:cid/:dbq', validarJWT, dbqCtrl.obtenerDBQCurso);
// Admin
// router.post('/crear', [
//     check('cid', 'El id del curso es obligatorio').notEmpty(),
//     check('dbq', 'El dbq del dbq es obligatorio').notEmpty(),
//     check('nombre', 'El nombre del dbq es obligatorio').notEmpty(),
//     validarCampos, 
//     validarJWT
// ], dbqCtrl.crearDBQ);
// router.delete('/eliminar/:id', validarJWT, dbqCtrl.eliminarDBQ);
// router.put('/editar/:id', validarJWT, dbqCtrl.editarDBQ);
// router.put('/editar/:idUp/:idDown', validarJWT, dbqCtrl.editarDBQUpDown);
exports.default = router;
