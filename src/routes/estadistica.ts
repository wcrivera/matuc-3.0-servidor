import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt";

import * as estadisticaCtrl from "../controllers/estadistica";

const router = Router();

// Cliente
router.get("/obtener/:gid/:sid", validarJWT, estadisticaCtrl.obtenerDBQSeccion);

// Admin

export default router;
