import { Router } from 'express';

import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt';
import { validarCampos } from '../middlewares/validar-campos';

import * as dbqCtrl from '../controllers/activoquestion';

const router = Router();

// Cliente
router.get('/obtener/:mid', validarJWT, dbqCtrl.obtenerActivoQuestionsModulo);


export default router;



// import { Router } from "express";

// import { check } from "express-validator";
// import { validarAdminJWT, validarJWT } from "../middlewares/validar-jwt";
// import { validarCampos } from "../middlewares/validar-campos";

// import * as activoquestionCtrl from "../controllers/activoquestion";
// import * as dbqCtrl from "../controllers/dbq";

// const router = Router();

// // Cliente
// // router.get("/obtener/:mid", validarJWT, activoquestionCtrl.obtenerActivoQuestionsModulo);
// router.get('/obtener/:mid', validarJWT, dbqCtrl.obtenerDBQSModulo);
// // router.post(
// //   "/crear/:sid",
// //   [
// //     check("gid", "El id del grupo es obligatorio").notEmpty(),
// //     check("cid", "El id del curso es obligatorio").notEmpty(),
// //     check("mid", "El id del modulo es obligatorio").notEmpty(),
// //     check("bid", "El id del bloque es obligatorio").notEmpty(),
// //     check("sid", "El id del sección es obligatorio").notEmpty(),
// //     check("activo", "El activo del modulo es obligatorio").notEmpty(),
// //     validarCampos,
// //     validarJWT,
// //   ],
// //   activoquestionCtrl.crearActivoQuestion
// // );
// // router.put("/editar/:id", validarJWT, activoquestionCtrl.editarActivoQuestion);

// // // Admin
// // router.get(
// //   "/admin/obtener/:mid",
// //   validarAdminJWT,
// //   activoquestionCtrl.obtenerActivoQuestionsModulo
// // );
// // router.post(
// //   "/admin/crear",
// //   [
// //     check("cid", "El id del curso es obligatorio").notEmpty(),
// //     check("mid", "El id del modulo es obligatorio").notEmpty(),
// //     check("activoquestion", "El activoquestion del modulo es obligatorio").notEmpty(),
// //     check("nombre", "El nombre del modulo es obligatorio").notEmpty(),
// //     validarCampos,
// //     validarAdminJWT,
// //   ],
// //   activoquestionCtrl.crearActivoQuestion
// // );
// // router.delete(
// //   "/admin/eliminar/:bid",
// //   validarAdminJWT,
// //   activoquestionCtrl.eliminarActivoQuestion
// // );
// // router.put("/admin/editar/:bid", validarAdminJWT, activoquestionCtrl.editarActivoQuestion);

// export default router;
