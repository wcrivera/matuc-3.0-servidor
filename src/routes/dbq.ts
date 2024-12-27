import { Router } from 'express';

import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt';
import { validarCampos } from '../middlewares/validar-campos';

import * as dbqCtrl from '../controllers/dbq';

const router = Router();

// Cliente
router.get('/obtener/:mid', validarJWT, dbqCtrl.obtenerDBQSModulo);
router.get('/obtener/question/:qid', validarJWT, dbqCtrl.obtenerDBQQuestion);
router.post('/crear/:pid', [
    check('cid', 'El id de curso es obligatorio').notEmpty(),
    check('mid', 'El id del módulo es obligatorio').notEmpty(),
    check('pid', 'El id de la pregunta es obligatorio').notEmpty(),
    check('respuesta', 'La respuesta de la pregunta es obligatoria').notEmpty(),
    check('estado', 'El estado de la pregunta es obligatorio').notEmpty(),
    validarCampos, 
    validarJWT
], dbqCtrl.crearDBQ);

// router.get('/obtener/:cid/:dbq', validarJWT, dbqCtrl.obtenerDBQCurso);

// Admin
// router.post('/crear', [
//     check('cid', 'El id del curso es obligatorio').notEmpty(),
//     check('dbq', 'El dbq del dbq es obligatorio').notEmpty(),
//     check('nombre', 'El nombre del dbq es obligatorio').notEmpty(),
//     validarCampos, 
//     validarJWT
// ], dbqCtrl.crearDBQ);
// router.delete('/eliminar/:id', validarJWT, dbqCtrl.eliminarDBQ);
// router.put('/editar/:id', validarJWT, dbqCtrl.editarDBQ);
// router.put('/editar/:idUp/:idDown', validarJWT, dbqCtrl.editarDBQUpDown);




export default router;