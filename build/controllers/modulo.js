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
exports.editarModulo = exports.eliminarModulo = exports.crearModulo = exports.obtenerModulosCursoPublico = exports.obtenerModulosCurso = void 0;
const modulo_1 = __importDefault(require("../models/modulo"));
const usuario_1 = __importDefault(require("../models/usuario"));
const matricula_1 = __importDefault(require("../models/matricula"));
const obtenerModulosCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cid } = req.params;
    try {
        const modulos = yield modulo_1.default.find({ cid: cid }).sort({ modulo: 1 });
        const moduloNoticias = {
            mid: "0",
            cid: cid,
            modulo: 0,
            nombre: "Noticias",
        };
        return res.json({
            ok: true,
            msg: "Módulos obtenidos",
            modulos: [moduloNoticias, ...modulos],
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
exports.obtenerModulosCurso = obtenerModulosCurso;
const obtenerModulosCursoPublico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cid } = req.params;
    try {
        const modulos = yield modulo_1.default.find({ cid: cid }).sort("modulo");
        return res.json({
            ok: true,
            msg: "Módulos obtenidos",
            modulos,
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
exports.obtenerModulosCursoPublico = obtenerModulosCursoPublico;
// ADMINISTRADOR
const crearModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { modulo, nombre } = req.body;
        const nuevoModulo = new modulo_1.default({ cid, modulo, nombre });
        const moduloCreado = yield nuevoModulo.save();
        return res.json({
            ok: true,
            msg: "Módulo creado",
            moduloCreado,
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
exports.crearModulo = crearModulo;
const eliminarModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const modulo = yield modulo_1.default.findById(id);
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: modulo === null || modulo === void 0 ? void 0 : modulo.cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const moduloEliminado = yield modulo_1.default.findByIdAndDelete(id);
        if (moduloEliminado) {
            yield modulo_1.default.updateMany({ cid: moduloEliminado.cid, modulo: { $gt: moduloEliminado.modulo } }, { $inc: { modulo: -1 } });
            const modulosActualizado = yield modulo_1.default.find({
                cid: moduloEliminado.cid,
            }).sort({ modulo: 1 });
            return res.json({
                ok: true,
                msg: "Módulo eliminado",
                modulosActualizado,
            });
        }
        else {
            return res.json({
                ok: false,
                msg: "Módulo no existe",
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
exports.eliminarModulo = eliminarModulo;
const editarModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { id, modulo } = req.body;
        const mismoModuloEncontrado = yield modulo_1.default.findOne({ _id: id });
        if (!mismoModuloEncontrado) {
            return res.json({
                ok: false,
                msg: "Módulo no existe",
            });
        }
        if (mismoModuloEncontrado.modulo === modulo) {
            console.log("mismo módulo");
            yield modulo_1.default.findByIdAndUpdate(id, req.body, { new: true });
            const modulosEditado = yield modulo_1.default.find({ cid: cid }).sort({
                modulo: 1,
            });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                modulosEditado,
            });
        }
        const diferenteModuloEncontrado = yield modulo_1.default.findOne({ cid, modulo });
        if (!diferenteModuloEncontrado) {
            yield modulo_1.default.findByIdAndUpdate(id, req.body, { new: true });
            const modulosEditado = yield modulo_1.default.find({ cid: cid }).sort({
                modulo: 1,
            });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                modulosEditado,
            });
        }
        else {
            yield modulo_1.default.findByIdAndUpdate(id, req.body, { new: true });
            yield modulo_1.default.findByIdAndUpdate(diferenteModuloEncontrado._id, { modulo: mismoModuloEncontrado.modulo }, { new: true });
            const modulosEditado = yield modulo_1.default.find({ cid: cid }).sort({
                modulo: 1,
            });
            return res.json({
                ok: true,
                msg: "Módulo editado",
                modulosEditado,
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
exports.editarModulo = editarModulo;
// export const editarModuloUpDown: RequestHandler = async (req, res) => {
//   try {
//     const { uid } = req.params;
//     const usuario = await Usuario.findById(uid);
//     if (!usuario) {
//       return res.status(404).json({
//         ok: false,
//         msg: "Usuario no registrado",
//       });
//     }
//     if (usuario.admin === false) {
//       return res.status(403).json({
//         ok: false,
//         msg: "Usuario sin permiso",
//       });
//     }
//     const { moduloUp, moduloDown } = req.body;
//     const moduloUpEditado = await Modulo.findByIdAndUpdate(
//       moduloUp.id,
//       moduloUp,
//       { new: true }
//     );
//     const moduloDownEditado = await Modulo.findByIdAndUpdate(
//       moduloDown.id,
//       moduloDown,
//       { new: true }
//     );
//     return res.json({
//       ok: true,
//       msg: "Módulo editado",
//       moduloUpEditado,
//       moduloDownEditado,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       ok: false,
//       msg: "Estamos teniendo problemas, vuelva a intentarlo más tarde",
//     });
//   }
// };
