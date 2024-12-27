"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarAdminJWT = exports.validarPJWT = exports.validarJWT = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const validarJWT = (req, res, next) => {
    try {
        const token = req.header('x-token');
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }
        const payload = jwt.verify(token, config_1.default.SECRET_JWT_SEED_CLIENTE);
        req.params.uid = payload.uid;
        next();
    }
    catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        });
    }
};
exports.validarJWT = validarJWT;
const validarPJWT = (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }
        const payload = jwt.verify(token, config_1.default.SECRET_JWT_SEED_PIMU);
        req.params.nombre = payload.nombre;
        req.params.apellido = payload.apellido;
        req.params.email = payload.email;
        req.params.curso = payload.curso;
        req.params.grupo = payload.grupo;
        next();
    }
    catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        });
    }
};
exports.validarPJWT = validarPJWT;
const validarAdminJWT = (req, res, next) => {
    try {
        const token = req.header('x-token');
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }
        const payload = jwt.verify(token, config_1.default.SECRET_JWT_SEED_ADMIN);
        req.params.uid = payload.uid;
        next();
    }
    catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        });
    }
};
exports.validarAdminJWT = validarAdminJWT;
