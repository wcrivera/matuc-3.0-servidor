import { Router } from "express";

import { check } from "express-validator";
import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import * as dbpCtrl from "../controllers/dbp";

const router = Router();

// Cliente
router.get(
  "/obtener/:mid",
  validarJWT,
  dbpCtrl.obtenerDBPSModulo
);
router.post(
  "/crear/:pid",
  [
    check("cid", "El id de curso es obligatorio").notEmpty(),
    check("mid", "El id del módulo es obligatorio").notEmpty(),
    check("pid", "El id de la pregunta es obligatorio").notEmpty(),
    check("respuesta", "La respuesta de la pregunta es obligatoria").notEmpty(),
    check("estado", "El estado de la pregunta es obligatorio").notEmpty(),
    validarCampos,
    validarJWT,
  ],
  dbpCtrl.crearDBP
);

// router.get('/obtener/:cid/:dbp', validarJWT, dbpCtrl.obtenerDBPCurso);

// Admin
router.get("/admin/obtener/:mid", validarAdminJWT, dbpCtrl.obtenerDBPSModulo);
router.post(
  "/admin/crear/:pid",
  [
    check("cid", "El id de curso es obligatorio").notEmpty(),
    check("mid", "El id del módulo es obligatorio").notEmpty(),
    check("pid", "El id de la pregunta es obligatorio").notEmpty(),
    check("respuesta", "La respuesta de la pregunta es obligatoria").notEmpty(),
    check("estado", "El estado de la pregunta es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  dbpCtrl.crearDBP
);

export default router;
