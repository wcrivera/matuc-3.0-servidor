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
exports.editarMatricula = exports.crearMatricula = exports.obtenerMatriculasCurso = exports.crearMatriculaCurso = exports.obtenerMatricula = exports.obtenerMatriculas = void 0;
const matricula_1 = __importDefault(require("../models/matricula"));
const usuario_1 = __importDefault(require("../models/usuario"));
const obtenerMatriculas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    try {
        const matriculas = yield matricula_1.default.find({ uid: uid });
        if (!matriculas) {
            return res.json({
                ok: false,
                msg: "Estudiante no matriculado",
            });
        }
        return res.json({
            ok: true,
            msg: "Estudiante matriculado",
            matriculas,
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
exports.obtenerMatriculas = obtenerMatriculas;
const obtenerMatricula = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, gid } = req.params;
    try {
        const matricula = yield matricula_1.default.findOne({ uid: uid, gid: gid });
        if (!matricula) {
            return res.json({
                ok: false,
                msg: "Estudiante no matriculado",
            });
        }
        return res.json({
            ok: true,
            msg: "Estudiante matriculado",
            matricula,
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
exports.obtenerMatricula = obtenerMatricula;
const crearMatriculaCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const { cid, gid } = req.body;
        const matricula = yield matricula_1.default.findOne({ gid: gid, uid: uid });
        if (matricula) {
            return res.json({
                ok: true,
                msg: "Estudiante matriculado",
                matricula,
            });
        }
        const nuevaMatricula = new matricula_1.default({
            cid: cid,
            gid: gid,
            uid: uid,
            rol: "Estudiante",
            online: false,
        });
        const matriculaCreada = yield nuevaMatricula.save();
        return res.json({
            ok: true,
            msg: "Matricula creada",
            matricula: matriculaCreada,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
        });
    }
    // try {
    //   const { uid } = req.params;
    //   const { cid } = req.body;
    //   const matricula = await Matricula.findOne({ cid: cid, uid: uid });
    //   if (matricula) {
    //     return res.json({
    //       ok: true,
    //       msg: "Estudiante matriculado",
    //       matricula,
    //     });
    //   }
    //   const grupo = await Grupo.findOne({ cid: cid });
    //   if (grupo) {
    //     const nuevaMatricula = new Matricula({
    //       cid,
    //       gid: grupo._id,
    //       uid: uid,
    //       rol: "Estudiante",
    //       online: false,
    //     });
    //     const matriculaCreada = await nuevaMatricula.save();
    //     return res.json({
    //       ok: true,
    //       msg: "Matricula creada",
    //       matricula: matriculaCreada,
    //     });
    //   } else {
    //     const nuevoGrupo = new Grupo({ cid: cid, grupo: 100 });
    //     const grupoCreado = await nuevoGrupo.save();
    //     const nuevaMatricula = new Matricula({
    //       cid,
    //       gid: grupoCreado._id,
    //       uid,
    //       rol: "Estudiante",
    //       online: false,
    //     });
    //     const matriculaCreada = await nuevaMatricula.save();
    //     return res.json({
    //       ok: true,
    //       msg: "Matricula creada",
    //       matricula: matriculaCreada,
    //     });
    //   }
    // } catch (error) {
    //   console.log(error);
    //   return res.status(500).json({
    //     ok: false,
    //     msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
    //   });
    // }
});
exports.crearMatriculaCurso = crearMatriculaCurso;
// ADMINISTRADOR
const obtenerMatriculasCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const matriculas = yield matricula_1.default.find({ cid: cid });
        if (!matriculas) {
            return res.json({
                ok: false,
                msg: "Estudiante no matriculado",
            });
        }
        return res.json({
            ok: true,
            msg: "Estudiante matriculado",
            matriculas,
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
exports.obtenerMatriculasCurso = obtenerMatriculasCurso;
const crearMatricula = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { cid, uid: uidUsuario } = req.body;
        const matriculaEncontrada = yield matricula_1.default.findOne({
            cid: cid,
            uid: uidUsuario,
        });
        if (matriculaEncontrada) {
            const matriculaEditada = yield matricula_1.default.findByIdAndUpdate(matriculaEncontrada._id, req.body, {
                new: true,
            });
            return res.json({
                ok: true,
                msg: "Existe",
                matriculaCreada: matriculaEditada,
            });
        }
        else {
            const nuevaMatricula = new matricula_1.default(req.body);
            const matriculaCreada = yield nuevaMatricula.save();
            return res.json({
                ok: true,
                msg: "Creado",
                matriculaCreada: matriculaCreada,
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
exports.crearMatricula = crearMatricula;
const editarMatricula = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, id } = req.params;
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
        const matriculaEditada = yield matricula_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        return res.json({
            ok: true,
            msg: "Matricula editada",
            matriculaEditada,
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
exports.editarMatricula = editarMatricula;
