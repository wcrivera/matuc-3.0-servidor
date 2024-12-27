import { Router } from "express";

import { check } from "express-validator";
import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import * as videoCtrl from "../controllers/video";

const router = Router();

// Cliente
router.get("/obtener/:mid", validarJWT, videoCtrl.obtenerVideosModulo);
router.get("/obtener/seccion/:sid", validarJWT, videoCtrl.obtenerVideoSeccion);

// Admin
router.get("/admin/obtener/:mid", validarAdminJWT, videoCtrl.obtenerVideosModulo);
router.post(
  "/admin/crear",
  [
    check("cid", "El id del curso es obligatorio").notEmpty(),
    check("mid", "El id del módulo es obligatorio").notEmpty(),
    check("bid", "El id del bloque es obligatorio").notEmpty(),
    check("sid", "El id de la sección es obligatorio").notEmpty(),
    check("url", "El url del video es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  videoCtrl.crearVideo
);

router.delete("/admin/eliminar/:vid", validarAdminJWT, videoCtrl.eliminarVideo);
router.put("/admin/editar/:vid", validarAdminJWT, videoCtrl.editarVideo);

export default router;
