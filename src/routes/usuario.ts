import { Router } from "express";

import * as usuarioCtrl from "../controllers/usuario";
import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos";
import { validarGoogleToken } from "../middlewares/validar-google-token";

const router = Router();
// CLIENTE
router.post("/outlook", usuarioCtrl.loginOutlook);
router.post("/login", usuarioCtrl.login);
router.post('/google', validarGoogleToken, usuarioCtrl.loginGoogle);
router.get("/renew", validarJWT, usuarioCtrl.renewToken);

router.put("/editar/:uid", usuarioCtrl.editarUsuario);


// ADMINISTRADOR
router.post("/admin/outlook", usuarioCtrl.loginOutlookAdmin);
router.get(
  "/admin/obtener/:cid",
  validarAdminJWT,
  usuarioCtrl.obtenerUsuariosCurso
);
router.post(
  "/admin/crear/password",
  [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("apellido", "El apellido es obligatorio").notEmpty(),
    check("email", "El email es obligatorio").notEmpty(),
    check("password", "El password es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  usuarioCtrl.crearUsuarioPassword
);
router.post(
  "/admin/crear",
  [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("apellido", "El apellido es obligatorio").notEmpty(),
    check("email", "El email es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  usuarioCtrl.crearUsuario
);
router.delete(
  "/admin/eliminar/:id",
  validarAdminJWT,
  usuarioCtrl.eliminarUsuario
);
router.put("/admin/editar/:uid", validarAdminJWT, usuarioCtrl.editarUsuario);

export default router;
