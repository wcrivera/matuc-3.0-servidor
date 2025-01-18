import { Router } from 'express';

import { check } from 'express-validator';
import { validarAdminJWT, validarJWT } from '../middlewares/validar-jwt';
import { validarCampos } from '../middlewares/validar-campos';

import * as matriculaCtrl from '../controllers/matricula';

const router = Router();

// Cliente
router.get('/obtener', validarJWT, matriculaCtrl.obtenerMatriculas);
router.get('/obtener/:gid', validarJWT, matriculaCtrl.obtenerMatricula);
router.post('/crear/:gid', [
    check('gid', 'El id del grupo es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], matriculaCtrl.crearMatriculaCurso);

// Admin
router.get(
    "/admin/obtener/:cid",
    validarAdminJWT,
    matriculaCtrl.obtenerMatriculasCurso
);
router.put(
    "/admin/editar/:id",
    validarAdminJWT,
    matriculaCtrl.editarMatricula
);

router.post('/admin/crear', [
    check('cid', 'El id del curso es obligatorio').notEmpty(),
    check('gid', 'El id del grupo es obligatorio').notEmpty(),
    check('uid', 'El id del usuario es obligatorio').notEmpty(),
    check('rol', 'El rol del usuario es obligatorio').notEmpty(),
    validarCampos,
    validarAdminJWT
], matriculaCtrl.crearMatricula);


// router.get('/obtener/:cid/:matricula', validarJWT, matriculaCtrl.obtenerMatriculaCurso);

// Admin
// router.post('/crear', [
//     check('cid', 'El id del curso es obligatorio').notEmpty(),
//     check('matricula', 'El matricula del matricula es obligatorio').notEmpty(),
//     check('nombre', 'El nombre del matricula es obligatorio').notEmpty(),
//     validarCampos, 
//     validarJWT
// ], matriculaCtrl.crearMatricula);
// router.delete('/eliminar/:id', validarJWT, matriculaCtrl.eliminarMatricula);
// router.put('/editar/:id', validarJWT, matriculaCtrl.editarMatricula);
// router.put('/editar/:idUp/:idDown', validarJWT, matriculaCtrl.editarMatriculaUpDown);




export default router;