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
exports.editarNoticia = exports.eliminarNoticia = exports.crearNoticia = exports.obtenerNoticiasCurso = void 0;
const noticia_1 = __importDefault(require("../models/noticia"));
const usuario_1 = __importDefault(require("../models/usuario"));
const matricula_1 = __importDefault(require("../models/matricula"));
const obtenerNoticiasCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, cid } = req.params;
    try {
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: cid });
        if (usuario.admin || (matricula === null || matricula === void 0 ? void 0 : matricula.rol) === "Administrador") {
            const noticias = yield noticia_1.default.find({ cid: cid }).sort({ fecha: -1 });
            return res.json({
                ok: true,
                msg: "Noticias obtenidos",
                noticias,
            });
        }
        const noticias = yield noticia_1.default.find({ cid: cid, activo: true }).sort({
            fecha: -1,
        });
        return res.json({
            ok: true,
            msg: "Noticias obtenidos",
            noticias,
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
exports.obtenerNoticiasCurso = obtenerNoticiasCurso;
// ADMINISTRADOR
const crearNoticia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const nuevaNoticia = new noticia_1.default(req.body);
        const noticiaCreada = yield nuevaNoticia.save();
        return res.json({
            ok: true,
            msg: "Noticia creada",
            noticiaCreada,
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
exports.crearNoticia = crearNoticia;
const eliminarNoticia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const noticia = yield noticia_1.default.findById(id);
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: noticia === null || noticia === void 0 ? void 0 : noticia.cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const noticiaEliminada = yield noticia_1.default.findByIdAndDelete(id);
        return res.json({
            ok: true,
            msg: "Noticia eliminada",
            noticiaEliminada,
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
exports.eliminarNoticia = eliminarNoticia;
const editarNoticia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { id } = req.body;
        const noticiaEditada = yield noticia_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        return res.json({
            ok: true,
            msg: "Noticia editada",
            noticiaEditada,
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
exports.editarNoticia = editarNoticia;
