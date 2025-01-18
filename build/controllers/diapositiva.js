"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editarDiapositiva = exports.eliminarDiapositiva = exports.crearDiapositiva = exports.obtenerDiapositivasBloquePublico = exports.obtenerDiapositivaSeccion = exports.obtenerDiapositivasBloque = exports.obtenerDiapositivasModulo = void 0;
const diapositiva_1 = __importDefault(require("../models/diapositiva"));
const usuario_1 = __importDefault(require("../models/usuario"));
const matricula_1 = __importDefault(require("../models/matricula"));
// import Modulo from "../models/modulo";
const seccion_1 = __importDefault(require("../models/seccion"));
const activo_1 = __importDefault(require("../models/activo"));
const obtenerDiapositivasModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mid } = req.params;
    try {
        // const { uid } = req.params;
        // const modulo = await Modulo.findOne({ _id: mid });
        // if (!modulo) {
        //   return res.status(404).json({
        //     ok: false,
        //     msg: "Modulo no encontrado",
        //   });
        // }
        // const matricula = await Matricula.findOne({ cid: modulo.cid, uid: uid });
        // if (!matricula) {
        //   return res.status(404).json({
        //     ok: false,
        //     msg: "Matrícula no existe",
        //   });
        // }
        // if (matricula.rol === "Profesor" || matricula.rol === "Ayudante") {
        //   const diapositivas = await Diapositiva.find(
        //     { mid: mid },
        //     {
        //       cid: false,
        //       mid: false,
        //       autor: false,
        //       diapositivas: false,
        //       publico: false,
        //     }
        //   );
        //   return res.json({
        //     ok: true,
        //     diapositivas,
        //   });
        // }
        // const activos = (await Activo.find({ mid: mid }))
        //   .filter((item) => item.diapositiva.activo)
        //   .map((item) => item.sid.toString());
        // const diapositivas = await Diapositiva.find(
        //   { sid: { $in: activos } },
        //   {
        //     cid: false,
        //     mid: false,
        //     autor: false,
        //     diapositivas: false,
        //     publico: false,
        //   }
        // );
        const diapositivas = yield diapositiva_1.default.find({ mid: mid }, {
            cid: false,
            mid: false,
            autor: false,
            diapositivas: false,
            publico: false,
        });
        return res.json({
            ok: true,
            diapositivas,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
});
exports.obtenerDiapositivasModulo = obtenerDiapositivasModulo;
const obtenerDiapositivasBloque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bid } = req.params;
    try {
        // const { uid } = req.params;
        // const bloque = await Bloque.findOne({ _id: bid });
        // if (!bloque) {
        //   return res.status(404).json({
        //     ok: false,
        //     msg: "Bloque no encontrado",
        //   });
        // }
        // const matricula = await Matricula.findOne({ cid: bloque.cid, uid: uid });
        // if (!matricula) {
        //   return res.status(404).json({
        //     ok: false,
        //     msg: "Matrícula no existe",
        //   });
        // }
        // if (matricula.rol === "Profesor" || matricula.rol === "Ayudante") {
        //   const diapositivas = await Diapositiva.find({ bid: bid });
        //   return res.json({
        //     ok: true,
        //     diapositivas,
        //   });
        // }
        const activos = (yield activo_1.default.find({ bid: bid }))
            .filter((item) => item.diapositiva.activo)
            .map((item) => item.sid.toString());
        if (activos.length === 0) {
            return res.json({
                ok: false,
                msg: "Diapositiva no existe",
            });
        }
        const diapositivas = yield diapositiva_1.default.find({ sid: { $in: activos } });
        // console.log(diapositivas)
        return res.json({
            ok: true,
            diapositivas,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
});
exports.obtenerDiapositivasBloque = obtenerDiapositivasBloque;
const obtenerDiapositivaSeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sid } = req.params;
    try {
        const { uid } = req.params;
        const seccion = yield seccion_1.default.findOne({ _id: sid });
        if (!seccion) {
            return res.status(404).json({
                ok: false,
                msg: "Sección no encontrada",
            });
        }
        const matricula = yield matricula_1.default.findOne({ cid: seccion.cid, uid: uid });
        if (!matricula) {
            return res.status(404).json({
                ok: false,
                msg: "Matrícula no existe",
            });
        }
        // console.log(matricula)
        if (matricula.rol === "Profesor" || matricula.rol === "Ayudante") {
            const diapositiva = yield diapositiva_1.default.findOne({ sid: sid });
            return res.json({
                ok: true,
                diapositiva,
            });
        }
        const activo = yield activo_1.default.findOne({ sid: sid });
        if (activo && activo.diapositiva.activo) {
            const diapositiva = yield diapositiva_1.default.findOne({ sid: sid });
            return res.json({
                ok: true,
                diapositiva,
            });
        }
        return res.json({
            ok: false,
            msg: "Diapositiva no está activa",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
});
exports.obtenerDiapositivaSeccion = obtenerDiapositivaSeccion;
const obtenerDiapositivasBloquePublico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bid } = req.params;
    try {
        // const diapositivas = await Diapositiva.find({ bid: bid, publico: true });
        const diapositivas = yield diapositiva_1.default.find({ bid: bid });
        if (diapositivas.length === 0) {
            return res.json({
                ok: false,
                msg: "Diapositiva no existe",
            });
        }
        return res.json({
            ok: true,
            diapositivas,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
});
exports.obtenerDiapositivasBloquePublico = obtenerDiapositivasBloquePublico;
// ADMINISTRADOR
const crearDiapositiva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { cid } = req.body;
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const nuevaDiapositiva = new diapositiva_1.default(req.body);
        const diapositivaCreada = yield nuevaDiapositiva.save();
        return res.json({
            ok: true,
            msg: "Diapositiva creada",
            diapositivaCreada,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.crearDiapositiva = crearDiapositiva;
const eliminarDiapositiva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { cid } = req.body;
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const { did } = req.params;
        const diapositivaEliminada = yield diapositiva_1.default.findByIdAndDelete(did);
        return res.json({
            ok: true,
            msg: "Diapositiva eliminada",
            diapositivaEliminada,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.eliminarDiapositiva = eliminarDiapositiva;
const editarDiapositiva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { did } = req.params;
        const diapositiva = yield diapositiva_1.default.findById(did);
        const matricula = yield matricula_1.default.findOne({
            uid: uid,
            cid: diapositiva === null || diapositiva === void 0 ? void 0 : diapositiva.cid,
        });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const mismaDiapositivaEncontrado = yield diapositiva_1.default.findOne({ _id: did });
        if (!mismaDiapositivaEncontrado) {
            return res.json({
                ok: false,
                msg: "Diapositiva no existe",
            });
        }
        const diapositivaEditada = yield diapositiva_1.default.findByIdAndUpdate(did, req.body, { new: true });
        return res.json({
            ok: true,
            msg: "Diapositiva editada",
            diapositivaEditada,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.editarDiapositiva = editarDiapositiva;
