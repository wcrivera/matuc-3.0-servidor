import { Router } from 'express';

import { check } from 'express-validator';
import { validarAdminJWT, validarJWT } from '../middlewares/validar-jwt';
import { validarCampos } from '../middlewares/validar-campos';

import * as grupoCtrl from '../controllers/grupo';
import { obtenerGrupos } from '../controllers/grupo';

const router = Router();

// Cliente
router.get('/obtener', validarJWT, grupoCtrl.obtenerGrupos);

// Admin
router.get(
    "/admin/obtener/:cid",
    validarAdminJWT,
    grupoCtrl.obtenerGruposCurso
);
router.post('/admin/crear/', [
    check('sigla', 'La sigla es obligatoria').notEmpty(),
    check('grupo', 'La grupo es obligatorio').notEmpty(),
    validarCampos,
    validarAdminJWT
], grupoCtrl.crearGrupo);

export default router;