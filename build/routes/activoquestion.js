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
const validar_jwt_1 = require("../middlewares/validar-jwt");
const dbqCtrl = __importStar(require("../controllers/activoquestion"));
const router = (0, express_1.Router)();
// Cliente
router.get('/obtener/:mid', validar_jwt_1.validarJWT, dbqCtrl.obtenerActivoQuestionsModulo);
exports.default = router;
// import { Router } from "express";
// import { check } from "express-validator";
// import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
// import { validarCampos } from "../middlewares/validar-campos";
// import * as activoquestionCtrl from "../controllers/activoquestion";
// import * as dbqCtrl from "../controllers/dbq";
// const router = Router();
// // Cliente
// // router.get("/obtener/:mid", validarJWT, activoquestionCtrl.obtenerActivoQuestionsModulo);
// router.get('/obtener/:mid', validarJWT, dbqCtrl.obtenerDBQSModulo);
// // router.post(
// //   "/crear/:sid",
// //   [
// //     check("gid", "El id del grupo es obligatorio").notEmpty(),
// //     check("cid", "El id del curso es obligatorio").notEmpty(),
// //     check("mid", "El id del modulo es obligatorio").notEmpty(),
// //     check("bid", "El id del bloque es obligatorio").notEmpty(),
// //     check("sid", "El id del sección es obligatorio").notEmpty(),
// //     check("activo", "El activo del modulo es obligatorio").notEmpty(),
// //     validarCampos,
// //     validarJWT,
// //   ],
// //   activoquestionCtrl.crearActivoQuestion
// // );
// // router.put("/editar/:id", validarJWT, activoquestionCtrl.editarActivoQuestion);
// // // Admin
// // router.get(
// //   "/admin/obtener/:mid",
// //   validarAdminJWT,
// //   activoquestionCtrl.obtenerActivoQuestionsModulo
// // );
// // router.post(
// //   "/admin/crear",
// //   [
// //     check("cid", "El id del curso es obligatorio").notEmpty(),
// //     check("mid", "El id del modulo es obligatorio").notEmpty(),
// //     check("activoquestion", "El activoquestion del modulo es obligatorio").notEmpty(),
// //     check("nombre", "El nombre del modulo es obligatorio").notEmpty(),
// //     validarCampos,
// //     validarAdminJWT,
// //   ],
// //   activoquestionCtrl.crearActivoQuestion
// // );
// // router.delete(
// //   "/admin/eliminar/:bid",
// //   validarAdminJWT,
// //   activoquestionCtrl.eliminarActivoQuestion
// // );
// // router.put("/admin/editar/:bid", validarAdminJWT, activoquestionCtrl.editarActivoQuestion);
// export default router;
