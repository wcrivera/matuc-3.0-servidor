import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import config from '../config';

export const validarJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        
        const token = req.header('x-token');

        if ( !token ) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }

        const payload: any = jwt.verify( token, config.SECRET_JWT_SEED_CLIENTE );

        req.params.uid = payload.uid;

        next();

    } catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        });
    }
}

export const validarPJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {

        const { token } = req.body;

        if ( !token ) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }

        const payload: any = jwt.verify( token, config.SECRET_JWT_SEED_PIMU );

        req.params.nombre = payload.nombre;
        req.params.apellido = payload.apellido;
        req.params.email = payload.email;
        req.params.curso = payload.curso;
        req.params.grupo = payload.grupo;

        next();

    } catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        });
    }
}

export const validarAdminJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        
        const token = req.header('x-token');

        if ( !token ) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }

        const payload: any = jwt.verify( token, config.SECRET_JWT_SEED_ADMIN );

        req.params.uid = payload.uid;

        next();

    } catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        });
    }
}