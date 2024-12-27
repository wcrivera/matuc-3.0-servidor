import { Router } from "express";

import { check } from "express-validator";
import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import * as cursoCtrl from "../controllers/curso";

const router = Router();

// CLIENTE
router.get("/obtener", validarJWT, cursoCtrl.obtenerCursos);
router.get("/obtener/:cid", validarJWT, cursoCtrl.obtenerCurso);
router.get("/obtener-publico", cursoCtrl.obtenerCursosPublico);

// ADMINISTRADOR
router.get("/admin/obtener", validarAdminJWT, cursoCtrl.obtenerCursos);
router.post(
  "/admin/crear",
  [
    check("sigla", "La sigla del curso es obligatoria").notEmpty(),
    check("nombre", "El nombre del curso es obligatorio").notEmpty(),
    check("descripcion", "La descripción del curso es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  cursoCtrl.crearCurso
);
router.delete("/admin/eliminar/:cid", validarAdminJWT, cursoCtrl.eliminarCurso);
router.put("/admin/editar/:cid", validarAdminJWT, cursoCtrl.editarCurso);

export default router;
