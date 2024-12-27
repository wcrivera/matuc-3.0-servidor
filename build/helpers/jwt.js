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
exports.comprobarAdminJWT = exports.comprobarJWT = exports.generarJWTAdmin = exports.generarJWT = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, config_1.default.SECRET_JWT_SEED_CLIENTE, {
            expiresIn: '60d'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generarJWT = generarJWT;
// export const generarPJWT = (uid : string) =>  {
//     return new Promise(( resolve, reject ) => {
//         const payload = { nombre: 'Claudio', apellido: 'Rivera', email: 'wcrivera@uc.cl', curso: 'PIMUA', grupo: 1 };
//         jwt.sign(payload, config.SECRET_JWT_SEED_PIMU, {
//             expiresIn: '60d'
//         }, ( err, token) => {
//             if (err) {
//                 console.log(err);
//                 reject('No se pudo generar el JWT')
//             } else {
//                 resolve(token);
//             }
//         });
//     });
// }
const generarJWTAdmin = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, config_1.default.SECRET_JWT_SEED_ADMIN, {
            expiresIn: '60d'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generarJWTAdmin = generarJWTAdmin;
const comprobarJWT = (token = '') => {
    try {
        const payload = jwt.verify(token, config_1.default.SECRET_JWT_SEED_CLIENTE);
        return [true, payload.uid];
    }
    catch (error) {
        return [false, null];
    }
};
exports.comprobarJWT = comprobarJWT;
const comprobarAdminJWT = (token = '') => {
    try {
        const payload = jwt.verify(token, config_1.default.SECRET_JWT_SEED_ADMIN);
        return [true, payload.uid];
    }
    catch (error) {
        return [false, null];
    }
};
exports.comprobarAdminJWT = comprobarAdminJWT;
