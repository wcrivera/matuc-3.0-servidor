import { Router } from 'express';

import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt';
import { validarCampos } from '../middlewares/validar-campos';

import * as activoCtrl from '../controllers/activo';

const router = Router();

// Cliente
router.get("/obtener/:mid", validarJWT, activoCtrl.obtenerActivosModulo);
router.post('/crear/:pid', [
    check('gid', 'El id de grupo es obligatorio').notEmpty(),
    check('cid', 'El id de curso es obligatorio').notEmpty(),
    check('mid', 'El id del módulo es obligatorio').notEmpty(),
    check('bid', 'El id del bloque es obligatorio').notEmpty(),
    check('sid', 'El id de la sección es obligatorio').notEmpty(),
    validarCampos, 
    validarJWT
], activoCtrl.crearActivo);

router.put("/editar/:id", validarJWT, activoCtrl.editarActivo);

export default router;