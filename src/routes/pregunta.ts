import { Router } from 'express';

import { check } from 'express-validator';
import { validarAdminJWT, validarJWT } from '../middlewares/validar-jwt';
import { validarCampos } from '../middlewares/validar-campos';

import * as preguntaCtrl from '../controllers/pregunta';

const router = Router();

// Cliente
router.get('/obtener/:mid', validarJWT, preguntaCtrl.obtenerPreguntasModulo);
router.get('/obtener/evaluacion/:mid', validarJWT, preguntaCtrl.obtenerPreguntasEvaluacionModulo);
// Admin
router.get('/admin/obtener/:mid', validarAdminJWT, preguntaCtrl.obtenerPreguntasModulo);
router.post('/admin/crear', [
    check('cid', 'El id del curso es obligatorio').notEmpty(),
    check('mid', 'El id del módulo es obligatorio').notEmpty(),
    check('numero', 'El número es obligatorio').notEmpty(),
    validarCampos, 
    validarAdminJWT
], preguntaCtrl.crearPregunta);
router.delete('/admin/eliminar/:pid', validarAdminJWT, preguntaCtrl.eliminarPregunta);
router.put('/admin/editar/:eid', validarAdminJWT, preguntaCtrl.editarEjercicio);

export default router;