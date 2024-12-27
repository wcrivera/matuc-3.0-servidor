import { Router } from 'express';

import { check } from 'express-validator';
import { validarAdminJWT, validarJWT } from '../middlewares/validar-jwt';
import { validarCampos } from '../middlewares/validar-campos';

import * as ejercicioCtrl from '../controllers/ejercicio';

const router = Router();

// Cliente
router.get('/obtener/:mid', validarJWT, ejercicioCtrl.obtenerEjerciciosModulo);
// Admin
router.get('/admin/obtener/:mid', validarAdminJWT, ejercicioCtrl.obtenerEjerciciosModulo);
router.post('/admin/crear', [
    check('cid', 'El id del curso es obligatorio').notEmpty(),
    check('mid', 'El id del módulo es obligatorio').notEmpty(),
    check('numero', 'El número es obligatorio').notEmpty(),
    validarCampos, 
    validarAdminJWT
], ejercicioCtrl.crearEjercicio);
router.delete('/admin/eliminar/:eid', validarAdminJWT, ejercicioCtrl.eliminarEjercicio);
router.put('/admin/editar/:eid', validarAdminJWT, ejercicioCtrl.editarEjercicio);


export default router;