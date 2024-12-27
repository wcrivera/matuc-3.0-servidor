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
exports.editarBloque = exports.eliminarBloque = exports.crearBloque = exports.obtenerBloquesCursoPublico = exports.obtenerBloquesModulo = void 0;
const bloque_1 = __importDefault(require("../models/bloque"));
const usuario_1 = __importDefault(require("../models/usuario"));
const matricula_1 = __importDefault(require("../models/matricula"));
const obtenerBloquesModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, mid } = req.params;
    try {
        const bloques = yield bloque_1.default.find({ mid: mid }).sort({ bloque: 1 });
        return res.json({
            ok: true,
            bloques,
        });
    }
    catch (error) {
        console.log(error);
        const date = new Date();
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.obtenerBloquesModulo = obtenerBloquesModulo;
const obtenerBloquesCursoPublico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cid } = req.params;
    try {
        const bloques = yield bloque_1.default.find({ cid: cid }).sort({ bloque: 1 });
        return res.json({
            ok: true,
            msg: "Bloques obtenidos",
            bloques,
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
exports.obtenerBloquesCursoPublico = obtenerBloquesCursoPublico;
// ADMINISTRADOR
const crearBloque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { mid, bloque, nombre } = req.body;
        const nuevoBloque = new bloque_1.default({ cid, mid, bloque, nombre });
        const bloqueCreado = yield nuevoBloque.save();
        return res.json({
            ok: true,
            msg: "Bloque creado",
            bloqueCreado,
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
exports.crearBloque = crearBloque;
const eliminarBloque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const { bid } = req.params;
        const bloque = yield bloque_1.default.findById(bid);
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: bloque === null || bloque === void 0 ? void 0 : bloque.cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const bloqueEliminado = yield bloque_1.default.findByIdAndDelete(bid);
        if (bloqueEliminado) {
            yield bloque_1.default.updateMany({
                cid: bloqueEliminado.cid,
                mid: bloqueEliminado.mid,
                bloque: { $gt: bloqueEliminado.bloque },
            }, { $inc: { bloque: -1 } });
            const bloquesActualizado = yield bloque_1.default.find({
                mid: bloqueEliminado.mid,
            }).sort({ bloque: 1 });
            return res.json({
                ok: true,
                msg: "Bloque eliminado",
                bloquesActualizado,
            });
        }
        else {
            return res.json({
                ok: false,
                msg: "Bloque no existe",
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
exports.eliminarBloque = eliminarBloque;
const editarBloque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { bid, mid, bloque } = req.body;
        const mismoBloqueEncontrado = yield bloque_1.default.findOne({ _id: bid });
        if (!mismoBloqueEncontrado) {
            return res.json({
                ok: false,
                msg: "Bloque no existe",
            });
        }
        if (mismoBloqueEncontrado.bloque === bloque) {
            console.log("mismo bloque");
            yield bloque_1.default.findByIdAndUpdate(bid, req.body, { new: true });
            const bloquesEditado = yield bloque_1.default.find({ mid: mid }).sort({
                bloque: 1,
            });
            return res.json({
                ok: true,
                msg: "Bloque editado",
                bloquesEditado,
            });
        }
        const diferenteBloqueEncontrado = yield bloque_1.default.findOne({
            cid,
            mid,
            bloque,
        });
        if (!diferenteBloqueEncontrado) {
            yield bloque_1.default.findByIdAndUpdate(bid, req.body, { new: true });
            const bloquesEditado = yield bloque_1.default.find({ mid: mid }).sort({
                bloque: 1,
            });
            return res.json({
                ok: true,
                msg: "Bloque editado",
                bloquesEditado,
            });
        }
        else {
            yield bloque_1.default.findByIdAndUpdate(bid, req.body, { new: true });
            yield bloque_1.default.findByIdAndUpdate(diferenteBloqueEncontrado._id, { bloque: mismoBloqueEncontrado.bloque }, { new: true });
            const bloquesEditado = yield bloque_1.default.find({ mid: mid }).sort({
                bloque: 1,
            });
            return res.json({
                ok: true,
                msg: "Bloque editado",
                bloquesEditado,
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
exports.editarBloque = editarBloque;
