import { Router } from "express";

import { check } from "express-validator";
import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import * as bloqueCtrl from "../controllers/bloque";

const router = Router();

// Cliente
router.get("/obtener/:mid", validarJWT, bloqueCtrl.obtenerBloquesModulo);
router.get("/obtener-publico/:cid", bloqueCtrl.obtenerBloquesCursoPublico);

// Admin
router.get(
  "/admin/obtener/:mid",
  validarAdminJWT,
  bloqueCtrl.obtenerBloquesModulo
);
router.post(
  "/admin/crear",
  [
    check("cid", "El id del curso es obligatorio").notEmpty(),
    check("mid", "El id del modulo es obligatorio").notEmpty(),
    check("bloque", "El bloque del modulo es obligatorio").notEmpty(),
    check("nombre", "El nombre del modulo es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  bloqueCtrl.crearBloque
);
router.delete(
  "/admin/eliminar/:bid",
  validarAdminJWT,
  bloqueCtrl.eliminarBloque
);
router.put("/admin/editar/:bid", validarAdminJWT, bloqueCtrl.editarBloque);

export default router;
