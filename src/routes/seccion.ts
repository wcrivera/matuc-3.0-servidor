import { Router } from "express";

import { check } from "express-validator";
import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import * as seccionCtrl from "../controllers/seccion";

const router = Router();

// Cliente
router.get("/obtener/:mid", validarJWT, seccionCtrl.obtenerSeccionesModulo);
router.get('/obtener-publico/:bid', seccionCtrl.obtenerSeccionesBloquePublico);

// Admin
router.get(
  "/admin/obtener/:mid",
  validarAdminJWT,
  seccionCtrl.obtenerSeccionesModulo
);
router.post(
  "/admin/crear",
  [
    check("cid", "El id del curso es obligatorio").notEmpty(),
    check("mid", "El id del modulo es obligatorio").notEmpty(),
    check("bid", "El id del bloque es obligatorio").notEmpty(),
    check("seccion", "La sección de la sección es obligatoria").notEmpty(),
    check("nombre", "El nombre del modulo es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  seccionCtrl.crearSeccion
);
router.delete(
  "/admin/eliminar/:sid",
  validarAdminJWT,
  seccionCtrl.eliminarSeccion
);
router.put("/admin/editar/:sid", validarAdminJWT, seccionCtrl.editarSeccion);

export default router;
