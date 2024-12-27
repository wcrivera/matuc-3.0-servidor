import * as express from 'express';
import { validationResult } from "express-validator";

export const validarCampos = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.json({
            ok: true,
            errores: errores.mapped()
        })
    }
    } catch (error) {
     console.log(error)   
    }

    next();
    
}

