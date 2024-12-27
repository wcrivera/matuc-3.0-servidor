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
exports.editarEjercicio = exports.eliminarEjercicio = exports.crearEjercicio = exports.obtenerEjerciciosModulo = void 0;
const ejercicio_1 = __importDefault(require("../models/ejercicio"));
const usuario_1 = __importDefault(require("../models/usuario"));
const matricula_1 = __importDefault(require("../models/matricula"));
const obtenerEjerciciosModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, mid } = req.params;
    try {
        const ejercicios = yield ejercicio_1.default.find({ mid: mid }).sort({ numero: 1 });
        return res.json({
            ok: true,
            ejercicios: ejercicios,
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
exports.obtenerEjerciciosModulo = obtenerEjerciciosModulo;
// ADMINISTRADOR
const crearEjercicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { id } = req.params;
        const ejercicio = yield ejercicio_1.default.findById(id);
        const matricula = yield matricula_1.default.findOne({
            uid: uid,
            cid: ejercicio === null || ejercicio === void 0 ? void 0 : ejercicio.cid,
        });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const nuevoEjercicio = new ejercicio_1.default(req.body);
        const ejercicioCreado = yield nuevoEjercicio.save();
        return res.json({
            ok: true,
            msg: "Ejercicio creado",
            ejercicioCreado,
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
exports.crearEjercicio = crearEjercicio;
const eliminarEjercicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { eid } = req.params;
        const ejercicio = yield ejercicio_1.default.findById(eid);
        const matricula = yield matricula_1.default.findOne({
            uid: uid,
            cid: ejercicio === null || ejercicio === void 0 ? void 0 : ejercicio.cid,
        });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const ejercicioEliminado = yield ejercicio_1.default.findByIdAndDelete(eid);
        if (ejercicioEliminado) {
            yield ejercicio_1.default.updateMany({
                cid: ejercicioEliminado.cid,
                mid: ejercicioEliminado.mid,
                numero: { $gt: ejercicioEliminado.numero },
            }, { $inc: { numero: -1 } });
            const ejerciciosActualizado = yield ejercicio_1.default.find({
                cid: ejercicioEliminado.cid,
                mid: ejercicioEliminado.mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Ejercicio eliminado",
                ejerciciosActualizado,
            });
        }
        else {
            return res.json({
                ok: false,
                msg: "Ejercicio no existe",
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
exports.eliminarEjercicio = eliminarEjercicio;
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
        const { eid, mid, numero } = req.body;
        const mismaEjercicioEncontrada = yield ejercicio_1.default.findOne({ _id: eid });
        if (!mismaEjercicioEncontrada) {
            return res.json({
                ok: false,
                msg: "Ejercicio no existe",
            });
        }
        if (mismaEjercicioEncontrada.numero === numero) {
            console.log("mismo ejercicio");
            yield ejercicio_1.default.findByIdAndUpdate(eid, req.body, { new: true });
            const ejerciciosActualizado = yield ejercicio_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                ejerciciosActualizado,
            });
        }
        const diferenteEjercicioEncontrada = yield ejercicio_1.default.findOne({
            cid,
            mid,
            numero,
        });
        if (!diferenteEjercicioEncontrada) {
            yield ejercicio_1.default.findByIdAndUpdate(eid, req.body, { new: true });
            const ejerciciosActualizado = yield ejercicio_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                ejerciciosActualizado,
            });
        }
        else {
            yield ejercicio_1.default.findByIdAndUpdate(eid, req.body, { new: true });
            yield ejercicio_1.default.findByIdAndUpdate(diferenteEjercicioEncontrada._id, { numero: mismaEjercicioEncontrada.numero }, { new: true });
            const ejerciciosActualizado = yield ejercicio_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                ejerciciosActualizado,
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
