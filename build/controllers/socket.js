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
exports.crearDBQ = exports.ActivoSeccion = exports.obtenerUsuariosConectados = exports.desconectarUsuario = exports.conectarUsuario = void 0;
const matricula_1 = __importDefault(require("../models/matricula"));
const usuario_1 = __importDefault(require("../models/usuario"));
const activo_1 = __importDefault(require("../models/activo"));
const dbq_1 = __importDefault(require("../models/dbq"));
const conectarUsuario = (mid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matriculaUpdate = yield matricula_1.default.findByIdAndUpdate(mid, { online: true }, { new: true });
        if (matriculaUpdate) {
            return {
                ok: true,
            };
        }
        else {
            return {
                ok: false,
            };
        }
    }
    catch (error) {
        console.log(error);
        return { ok: false };
    }
});
exports.conectarUsuario = conectarUsuario;
const desconectarUsuario = (mid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield matricula_1.default.findByIdAndUpdate(mid, { online: false }, { new: true });
    }
    catch (error) {
        return { ok: false, payload: undefined };
    }
});
exports.desconectarUsuario = desconectarUsuario;
const obtenerUsuariosConectados = (cid, gid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matriculas = yield matricula_1.default.find({
            gid: gid,
            cid: cid,
            online: true,
        });
        const uids = matriculas.map((item) => item.uid);
        const usuarios = yield usuario_1.default.find({
            _id: {
                $in: uids,
            },
        }, { nombre: 1, apellido: 1 });
        return { ok: true, payload: usuarios };
    }
    catch (error) {
        console.log(error);
        return { ok: false, payload: undefined };
    }
});
exports.obtenerUsuariosConectados = obtenerUsuariosConectados;
const ActivoSeccion = (activo) => __awaiter(void 0, void 0, void 0, function* () {
    const { cid, gid, mid, bid, sid } = activo;
    try {
        const activoEncontrado = yield activo_1.default.findOne({
            cid: cid,
            gid: gid,
            mid: mid,
            bid: bid,
            sid: sid,
        });
        if (activoEncontrado) {
            const activoEditado = yield activo_1.default.findByIdAndUpdate(activoEncontrado._id, activo, { new: true });
            return { ok: true, payload: activoEditado };
        }
        const nuevoActivo = new activo_1.default({
            gid: activo.gid,
            cid: activo.cid,
            mid: activo.mid,
            bid: activo.bid,
            sid: activo.sid,
            diapositiva: activo.diapositiva,
            video: activo.video,
            pregunta: activo.pregunta,
        });
        const activoCreado = yield nuevoActivo.save();
        return { ok: true, payload: activoCreado };
    }
    catch (error) {
        console.log(error);
        return { ok: false, payload: activo };
    }
});
exports.ActivoSeccion = ActivoSeccion;
const crearDBQ = (activo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nuevoDBQ = new dbq_1.default({
            cid: activo.cid,
            mid: activo.mid,
            bid: activo.bid,
            sid: activo.sid,
            qid: activo.qid,
            uid: activo.uid,
            fecha: new Date(),
            respuesta: activo.respuesta,
            estado: activo.estado,
        });
        const dbqCreado = yield nuevoDBQ.save();
        return { ok: true, payload: dbqCreado };
    }
    catch (error) {
        console.log(error);
        return { ok: false, payload: activo };
    }
});
exports.crearDBQ = crearDBQ;
