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
exports.editarSeccion = exports.eliminarSeccion = exports.crearSeccion = exports.obtenerSeccionesBloquePublico = exports.obtenerSeccionesModulo = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const seccion_1 = __importDefault(require("../models/seccion"));
const matricula_1 = __importDefault(require("../models/matricula"));
const obtenerSeccionesModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mid, uid } = req.params;
    try {
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado",
            });
        }
        const secciones = yield seccion_1.default.find({ mid: mid }).sort({ seccion: 1 });
        return res.json({
            ok: true,
            secciones: secciones,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.obtenerSeccionesModulo = obtenerSeccionesModulo;
const obtenerSeccionesBloquePublico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bid } = req.params;
    try {
        const secciones = yield seccion_1.default.find({ bid: bid }).sort({ seccion: 1 });
        return res.json({
            ok: true,
            secciones: secciones,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.obtenerSeccionesBloquePublico = obtenerSeccionesBloquePublico;
// ADMINISTRADOR
const crearSeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { mid, bid, seccion, nombre } = req.body;
        const nuevaSeccion = new seccion_1.default({ cid, mid, bid, seccion, nombre });
        const seccionCreada = yield nuevaSeccion.save();
        return res.json({
            ok: true,
            msg: "Sección creada",
            seccionCreada,
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
exports.crearSeccion = crearSeccion;
const eliminarSeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { sid } = req.params;
        const seccion = yield seccion_1.default.findById(sid);
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: seccion === null || seccion === void 0 ? void 0 : seccion.cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const seccionEliminada = yield seccion_1.default.findByIdAndDelete(sid);
        if (seccionEliminada) {
            yield seccion_1.default.updateMany({
                cid: seccionEliminada.cid,
                mid: seccionEliminada.mid,
                bid: seccionEliminada.bid,
                seccion: { $gt: seccionEliminada.seccion },
            }, { $inc: { seccion: -1 } });
            const seccionesActualizada = yield seccion_1.default.find({
                mid: seccionEliminada.mid,
            }).sort({ seccion: 1 });
            return res.json({
                ok: true,
                msg: "Sección eliminada",
                seccionesActualizada,
            });
        }
        else {
            return res.json({
                ok: false,
                msg: "Sección no existe",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.eliminarSeccion = eliminarSeccion;
const editarSeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { sid, mid, bid, seccion } = req.body;
        const mismaSeccionEncontrado = yield seccion_1.default.findOne({ _id: sid });
        if (!mismaSeccionEncontrado) {
            return res.json({
                ok: false,
                msg: "Sección no existe",
            });
        }
        if (mismaSeccionEncontrado.seccion === seccion) {
            console.log("misma sección");
            yield seccion_1.default.findByIdAndUpdate(sid, req.body, { new: true });
            const seccionesEditada = yield seccion_1.default.find({ mid: mid }).sort({
                seccion: 1,
            });
            return res.json({
                ok: true,
                msg: "Sección editada",
                seccionesEditada,
            });
        }
        const diferenteSeccionEncontrada = yield seccion_1.default.findOne({
            cid,
            mid,
            bid,
            seccion,
        });
        if (!diferenteSeccionEncontrada) {
            yield seccion_1.default.findByIdAndUpdate(sid, req.body, { new: true });
            const seccionesEditada = yield seccion_1.default.find({ mid: mid }).sort({
                seccion: 1,
            });
            return res.json({
                ok: true,
                msg: "Sección editada",
                seccionesEditada,
            });
        }
        else {
            yield seccion_1.default.findByIdAndUpdate(sid, req.body, { new: true });
            yield seccion_1.default.findByIdAndUpdate(diferenteSeccionEncontrada._id, { seccion: mismaSeccionEncontrado.seccion }, { new: true });
            const seccionesEditada = yield seccion_1.default.find({ mid: mid }).sort({
                seccion: 1,
            });
            return res.json({
                ok: true,
                msg: "Sección editada",
                seccionesEditada,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.editarSeccion = editarSeccion;
