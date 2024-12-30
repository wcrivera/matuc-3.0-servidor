import { Router } from "express";

import { check } from "express-validator";
import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import * as questionCtrl from "../controllers/question";

const router = Router();

// Cliente
router.get("/obtener/:mid", validarJWT, questionCtrl.obtenerQuestionsModulo);
router.get("/obtener/seccion/:qid", validarJWT, questionCtrl.obtenerQuestionSeccion);
router.get("/obtener/questions/seccion/:sid", validarJWT, questionCtrl.obtenerQuestionsSeccion);
// Admin
router.get(
  "/admin/obtener/:mid",
  validarAdminJWT,
  questionCtrl.obtenerQuestionsModulo
);
router.post(
  "/admin/crear",
  [
    check("cid", "El id del curso es obligatorio").notEmpty(),
    check("mid", "El id del módulo es obligatorio").notEmpty(),
    check("bid", "El id del bloque es obligatorio").notEmpty(),
    check("sid", "El id de la sección es obligatorio").notEmpty(),
    check("numero", "El número es obligatorio").notEmpty(),
    validarCampos,
    validarAdminJWT,
  ],
  questionCtrl.crearQuestion
);

router.delete(
  "/admin/eliminar/:qid",
  validarAdminJWT,
  questionCtrl.eliminarQuestion
);
router.put("/admin/editar/:qid", validarAdminJWT, questionCtrl.editarQuestion);

export default router;
