import { Router } from "express";

import { check } from "express-validator";
import { validarAdminJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import * as videoCtrl from "../controllers/video";

const router = Router();

// Admin
router.post(
  "/admin/crear",
  [
    check("tipo", "El tipo de archivo es obligatorio").notEmpty(),
    check("carpeta", "La carpeta es obligatoria").notEmpty(),
    check("nombre", "El tipo de archivo es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  videoCtrl.crearVideo
);

router.delete("/admin/eliminar/:fid", validarAdminJWT, videoCtrl.eliminarVideo);
router.put("/admin/editar/:fid", validarAdminJWT, videoCtrl.editarVideo);

export default router;
