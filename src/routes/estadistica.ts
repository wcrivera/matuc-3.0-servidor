import { Router } from "express";

import { check } from "express-validator";
import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import * as estadisticaCtrl from "../controllers/estadistica";

const router = Router();

// Cliente
router.get("/obtener/:gid/:sid", validarJWT, estadisticaCtrl.obtenerEstadistica);

// Admin

export default router;
