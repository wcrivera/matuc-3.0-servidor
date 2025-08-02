import { Router } from 'express';

import { check } from 'express-validator';
import { validarAdminJWT, validarJWT } from '../middlewares/validar-jwt';
import { validarCampos } from '../middlewares/validar-campos';

import * as diapositivaCtrl from '../controllers/diapositiva';

const router = Router();

// Cliente
router.get('/obtener/:mid', validarJWT, diapositivaCtrl.obtenerDiapositivasModulo);
router.get('/obtener/seccion/:sid', validarJWT, diapositivaCtrl.obtenerDiapositivaSeccion);
router.get('/obtener/bloque/:bid', validarJWT, diapositivaCtrl.obtenerDiapositivasBloque);
router.get('/obtener-publico/:bid', diapositivaCtrl.obtenerDiapositivasBloquePublico);
router.get('/obtener-publico/curso/:sid', diapositivaCtrl.obtenerDiapositivasSeccionPublico);
// Admin
router.get('/admin/obtener/seccion/:sid', validarAdminJWT, diapositivaCtrl.obtenerDiapositivaSeccion);
router.get('/admin/obtener/:mid', validarAdminJWT, diapositivaCtrl.obtenerDiapositivasModulo);
router.post('/admin/crear', [
    check('cid', 'El id del curso es obligatorio').notEmpty(),
    check('mid', 'El id del módulo es obligatorio').notEmpty(),
    check('bid', 'El id del bloque es obligatorio').notEmpty(),
    check('sid', 'El id de la sección es obligatorio').notEmpty(),
    check('autor', 'El autor es obligatorio').notEmpty(),
    validarCampos, 
    validarAdminJWT
], diapositivaCtrl.crearDiapositiva);

router.delete('/admin/eliminar/:did', validarAdminJWT, diapositivaCtrl.eliminarDiapositiva);
router.put('/admin/editar/:did', validarAdminJWT, diapositivaCtrl.editarDiapositiva);

export default router;
