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
exports.editarCurso = exports.eliminarCurso = exports.crearCurso = exports.obtenerCursosPublico = exports.obtenerCurso = exports.obtenerCursos = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const curso_1 = __importDefault(require("../models/curso"));
const grupo_1 = __importDefault(require("../models/grupo"));
const matricula_1 = __importDefault(require("../models/matricula"));
// import mongoose from "mongoose";
const obtenerCursos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    try {
        const usuario = yield usuario_1.default.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        if (usuario.admin) {
            const cursos = yield curso_1.default.find().sort("sigla");
            return res.json({
                ok: true,
                msg: "Cursos obtenidos",
                cursos,
            });
        }
        const cursosUsuario = (yield matricula_1.default.find({ uid: uid })).map((item) => item.cid.toString());
        const cursos = yield curso_1.default.find({ _id: { $in: cursosUsuario } }
        // { publico: true, activo: true }
        ).sort("sigla");
        // console.log(cursos);
        return res.json({
            ok: true,
            msg: "Cursos obtenidos",
            cursos,
        });
        // Todos los cursos publicos y activos
        // const cursos = await Curso.find({ publico: true, activo: true }).sort(
        //   "sigla"
        // );
        // return res.json({
        //   ok: true,
        //   msg: "Cursos obtenidos",
        //   cursos,
        // });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
});
exports.obtenerCursos = obtenerCursos;
const obtenerCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cid } = req.params;
    try {
        const curso = yield curso_1.default.findById(cid);
        if (!curso) {
            return res.status(404).json({
                ok: false,
                msg: "Curso no encontrado",
            });
        }
        return res.json({
            ok: true,
            msg: "Curso obtenido",
            curso,
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
exports.obtenerCurso = obtenerCurso;
const obtenerCursosPublico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursos = yield curso_1.default.find({ publico: true }).sort("sigla");
        return res.json({
            ok: true,
            msg: "Cursos obtenidos",
            cursos,
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
exports.obtenerCursosPublico = obtenerCursosPublico;
// ADMINISTRADOR
const crearCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { sigla, nombre, descripcion } = req.body;
        const cursoEncontrado = yield curso_1.default.findOne({ sigla });
        if (cursoEncontrado) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un curso con esa sigla",
            });
        }
        const nuevoCurso = new curso_1.default({ sigla, nombre, descripcion });
        const cursoCreado = yield nuevoCurso.save();
        const nuevoGrupo = new grupo_1.default({ cid: cursoCreado._id, grupo: 100 });
        yield nuevoGrupo.save();
        return res.json({
            ok: true,
            msg: "Curso creado",
            cursoCreado,
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
exports.crearCurso = crearCurso;
const eliminarCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const cursoEliminado = yield curso_1.default.findByIdAndDelete(cid);
        return res.json({
            ok: true,
            msg: "Curso eliminado",
            cursoEliminado,
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
exports.eliminarCurso = eliminarCurso;
const editarCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { sigla } = req.body;
        const cursosEncontrados = yield curso_1.default.find({ sigla });
        const cursoIgualSigla = cursosEncontrados.filter((item) => item.id !== cid);
        if (cursoIgualSigla.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un curso con esa sigla",
            });
        }
        const cursoEditado = yield curso_1.default.findByIdAndUpdate(cid, req.body, {
            new: true,
        });
        return res.json({
            ok: true,
            msg: "Curso editado",
            cursoEditado,
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
exports.editarCurso = editarCurso;
