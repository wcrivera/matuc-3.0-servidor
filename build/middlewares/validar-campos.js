"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCampos = void 0;
const express_validator_1 = require("express-validator");
const validarCampos = (req, res, next) => {
    try {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.json({
                ok: true,
                errores: errores.mapped()
            });
        }
    }
    catch (error) {
        console.log(error);
    }
    next();
};
exports.validarCampos = validarCampos;
