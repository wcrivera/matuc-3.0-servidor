import { Router } from 'express';

import { check } from 'express-validator';
import { validarAdminJWT, validarJWT } from '../middlewares/validar-jwt';
import { validarCampos } from '../middlewares/validar-campos';

import * as noticiaCtrl from '../controllers/noticia';

const router = Router();

// Cliente
router.get('/obtener/:cid', validarJWT, noticiaCtrl.obtenerNoticiasCurso);

// Admin
router.get('/admin/obtener/:cid', validarAdminJWT, noticiaCtrl.obtenerNoticiasCurso);
router.post('/admin/crear', [
    check('cid', 'El id del curso es obligatorio').notEmpty(),
    check('fecha', 'La fecha de la noticia es obligatoria').notEmpty(),
    check('titulo', 'El titulo de la noticia es obligatoria').notEmpty(),
    check('contenido', 'El contenido de la noticia es obligatorio').notEmpty(),
    validarCampos, 
    validarAdminJWT
], noticiaCtrl.crearNoticia);
router.delete('/admin/eliminar/:id', validarAdminJWT, noticiaCtrl.eliminarNoticia);
router.put('/admin/editar/:id', validarAdminJWT, noticiaCtrl.editarNoticia);


export default router;