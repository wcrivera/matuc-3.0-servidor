import { Router } from "express";

import { check } from "express-validator";
import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import * as ayudantiaCtrl from "../controllers/ayudantia";

const router = Router();

// Cliente
router.get("/obtener/:mid", validarJWT, ayudantiaCtrl.obtenerAyudantiasCurso);

// Admin
router.get(
  "/admin/obtener/:mid",
  validarAdminJWT,
  ayudantiaCtrl.obtenerAyudantiasCurso
);
router.post(
  "/admin/crear",
  [
    check("cid", "El id del curso es obligatorio").notEmpty(),
    check("mid", "El id del módulo es obligatorio").notEmpty(),
    check("numero", "El número es obligatorio").notEmpty(),
    check("enunciado", "El enunciado es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  ayudantiaCtrl.crearEjercicio
);
router.delete(
  "/admin/eliminar/:id",
  validarAdminJWT,
  ayudantiaCtrl.eliminarEjercicio
);
router.put("/admin/editar/:id", validarAdminJWT, ayudantiaCtrl.editarEjercicio);

export default router;
