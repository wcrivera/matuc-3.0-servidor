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
exports.editarEjercicio = exports.eliminarPregunta = exports.crearPregunta = exports.obtenerPreguntasModulo = void 0;
const pregunta_1 = __importDefault(require("../models/pregunta"));
const usuario_1 = __importDefault(require("../models/usuario"));
const matricula_1 = __importDefault(require("../models/matricula"));
const obtenerPreguntasModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, mid } = req.params;
    try {
        const preguntas = yield pregunta_1.default.find({ mid: mid }).sort({ numero: 1 });
        return res.json({
            ok: true,
            preguntas: preguntas,
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
exports.obtenerPreguntasModulo = obtenerPreguntasModulo;
// ADMINISTRADOR
const crearPregunta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const nuevoPregunta = new pregunta_1.default(req.body);
        const preguntaCreada = yield nuevoPregunta.save();
        return res.json({
            ok: true,
            msg: "Pregunta creado",
            preguntaCreada,
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
exports.crearPregunta = crearPregunta;
const eliminarPregunta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { pid } = req.params;
        const pregunta = yield pregunta_1.default.findById(pid);
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: pregunta === null || pregunta === void 0 ? void 0 : pregunta.cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const preguntaEliminada = yield pregunta_1.default.findByIdAndDelete(pid);
        if (preguntaEliminada) {
            yield pregunta_1.default.updateMany({
                cid: preguntaEliminada.cid,
                mid: preguntaEliminada.mid,
                eid: preguntaEliminada.eid,
                numero: { $gt: preguntaEliminada.numero },
            }, { $inc: { numero: -1 } });
            const preguntasActualizada = yield pregunta_1.default.find({
                cid: preguntaEliminada.cid,
                mid: preguntaEliminada.mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Pregunta eliminada",
                preguntasActualizada,
            });
        }
        else {
            return res.json({
                ok: false,
                msg: "Pregunta no existe",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.eliminarPregunta = eliminarPregunta;
const editarEjercicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { pid, eid, mid, numero } = req.body;
        const mismaPreguntaEncontrada = yield pregunta_1.default.findOne({ _id: pid });
        if (!mismaPreguntaEncontrada) {
            return res.json({
                ok: false,
                msg: "Pregunta no existe",
            });
        }
        if (mismaPreguntaEncontrada.numero === numero) {
            console.log("mismo pregunta");
            yield pregunta_1.default.findByIdAndUpdate(pid, req.body, { new: true });
            const preguntasActualizada = yield pregunta_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                preguntasActualizada,
            });
        }
        const diferentePreguntaEncontrada = yield pregunta_1.default.findOne({
            cid,
            mid,
            eid,
            numero,
        });
        if (!diferentePreguntaEncontrada) {
            yield pregunta_1.default.findByIdAndUpdate(pid, req.body, { new: true });
            const preguntasActualizada = yield pregunta_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                preguntasActualizada,
            });
        }
        else {
            yield pregunta_1.default.findByIdAndUpdate(pid, req.body, { new: true });
            yield pregunta_1.default.findByIdAndUpdate(diferentePreguntaEncontrada._id, { numero: mismaPreguntaEncontrada.numero }, { new: true });
            const preguntasActualizada = yield pregunta_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                preguntasActualizada,
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
exports.editarEjercicio = editarEjercicio;
