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
exports.editarEjercicio = exports.eliminarEjercicio = exports.crearEjercicio = exports.obtenerAyudantiasCurso = void 0;
const ayudantia_1 = __importDefault(require("../models/ayudantia"));
const usuario_1 = __importDefault(require("../models/usuario"));
const matricula_1 = __importDefault(require("../models/matricula"));
const obtenerAyudantiasCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mid } = req.params;
    try {
        const ayudantias = yield ayudantia_1.default.find({ mid: mid }).sort({ numero: 1 });
        return res.json({
            ok: true,
            ayudantias,
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
exports.obtenerAyudantiasCurso = obtenerAyudantiasCurso;
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
        const { cid } = req.body;
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const nuevoEjercicio = new ayudantia_1.default(req.body);
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
        const { id } = req.params;
        const ayudantia = yield ayudantia_1.default.findById(id);
        const matricula = yield matricula_1.default.findOne({
            uid: uid,
            cid: ayudantia === null || ayudantia === void 0 ? void 0 : ayudantia.cid,
        });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const ayudantiaEliminada = yield ayudantia_1.default.findByIdAndDelete(id);
        if (ayudantiaEliminada) {
            yield ayudantia_1.default.updateMany({
                cid: ayudantiaEliminada.cid,
                mid: ayudantiaEliminada.mid,
                numero: { $gt: ayudantiaEliminada.numero },
            }, { $inc: { numero: -1 } });
            const ayudantiasActualizada = yield ayudantia_1.default.find({
                cid: ayudantiaEliminada.cid,
                mid: ayudantiaEliminada.mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Ejercicio eliminado",
                ayudantiasActualizada,
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
        const { id, mid, numero } = req.body;
        const mismaAyudantiaEncontrada = yield ayudantia_1.default.findOne({ _id: id });
        if (!mismaAyudantiaEncontrada) {
            return res.json({
                ok: false,
                msg: "Ejercicio no existe",
            });
        }
        if (mismaAyudantiaEncontrada.numero === numero) {
            console.log("mismo ejercicio");
            yield ayudantia_1.default.findByIdAndUpdate(id, req.body, { new: true });
            const ayudantiasActualizada = yield ayudantia_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                ayudantiasActualizada,
            });
        }
        const diferenteAyudantiaEncontrada = yield ayudantia_1.default.findOne({
            cid,
            mid,
            numero,
        });
        if (!diferenteAyudantiaEncontrada) {
            yield ayudantia_1.default.findByIdAndUpdate(id, req.body, { new: true });
            const ayudantiasActualizada = yield ayudantia_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                ayudantiasActualizada,
            });
        }
        else {
            yield ayudantia_1.default.findByIdAndUpdate(id, req.body, { new: true });
            yield ayudantia_1.default.findByIdAndUpdate(diferenteAyudantiaEncontrada._id, { numero: mismaAyudantiaEncontrada.numero }, { new: true });
            const ayudantiasActualizada = yield ayudantia_1.default.find({
                cid: cid,
                mid: mid,
            }).sort({ numero: 1 });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                ayudantiasActualizada,
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
