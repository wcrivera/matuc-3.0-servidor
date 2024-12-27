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
exports.crearGrupo = exports.obtenerGruposCurso = exports.obtenerGrupos = void 0;
const grupo_1 = __importDefault(require("../models/grupo"));
const usuario_1 = __importDefault(require("../models/usuario"));
const curso_1 = __importDefault(require("../models/curso"));
const obtenerGrupos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grupos = yield grupo_1.default.find().sort({ grupo: 1 });
        if (!grupos) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario sin grupo",
            });
        }
        return res.json({
            ok: true,
            msg: "Grupos obtenidos",
            grupos,
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
exports.obtenerGrupos = obtenerGrupos;
// ADMINISTRADOR
const obtenerGruposCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, cid } = req.params;
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        if (usuario.admin === false) {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const grupos = yield grupo_1.default.find({ cid: cid });
        if (!grupos) {
            return res.json({
                ok: false,
                msg: "Estudiante no matriculado",
            });
        }
        return res.json({
            ok: true,
            msg: "Estudiante matriculado",
            grupos
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
exports.obtenerGruposCurso = obtenerGruposCurso;
const crearGrupo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    try {
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        if (usuario.admin === false) {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const { sigla, grupo } = req.body;
        const cursoEncontrado = yield curso_1.default.findOne({ sigla: sigla });
        if (!cursoEncontrado) {
            return res.status(404).json({
                ok: false,
                msg: "Curso no existe",
            });
        }
        const grupoEncontrado = yield grupo_1.default.findOne({ cid: cursoEncontrado._id, grupo: grupo });
        if (grupoEncontrado) {
            return res.json({
                ok: true,
                msg: "Existe",
                grupoCreado: grupoEncontrado
            });
        }
        else {
            const nuevoGrupo = new grupo_1.default({ cid: cursoEncontrado._id, grupo: grupo });
            const grupoCreado = yield nuevoGrupo.save();
            return res.json({
                ok: true,
                msg: "Creado",
                grupoCreado: grupoCreado
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
exports.crearGrupo = crearGrupo;
