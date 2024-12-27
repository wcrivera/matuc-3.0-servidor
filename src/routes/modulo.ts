import { Router } from "express";

import { check } from "express-validator";
import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import * as moduloCtrl from "../controllers/modulo";

const router = Router();

// Cliente
router.get("/obtener/:cid", validarJWT, moduloCtrl.obtenerModulosCurso);
router.get("/obtener-publico/:cid", moduloCtrl.obtenerModulosCursoPublico);

// Admin
router.get(
  "/admin/obtener/:cid",
  validarAdminJWT,
  moduloCtrl.obtenerModulosCurso
);
router.post(
  "/admin/crear",
  [
    check("cid", "El id del curso es obligatorio").notEmpty(),
    check("modulo", "El modulo del modulo es obligatorio").notEmpty(),
    check("nombre", "El nombre del modulo es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  moduloCtrl.crearModulo
);
router.delete(
  "/admin/eliminar/:id",
  validarAdminJWT,
  moduloCtrl.eliminarModulo
);
router.put("/admin/editar/:id", validarAdminJWT, moduloCtrl.editarModulo);

export default router;
