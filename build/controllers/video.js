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
exports.editarVideo = exports.eliminarVideo = exports.crearVideo = exports.obtenerVideoSeccion = exports.obtenerVideosModulo = void 0;
const video_1 = __importDefault(require("../models/video"));
const usuario_1 = __importDefault(require("../models/usuario"));
const matricula_1 = __importDefault(require("../models/matricula"));
const activo_1 = __importDefault(require("../models/activo"));
// import Modulo from "../models/modulo";
const seccion_1 = __importDefault(require("../models/seccion"));
const obtenerVideosModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mid } = req.params;
    try {
        const { uid } = req.params;
        const usuario = yield usuario_1.default.findOne({ _id: uid });
        console.log(usuario);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no registrado",
            });
        }
        // if (!modulo) {
        //   return res.status(404).json({
        //     ok: false,
        //     msg: "Modulo no encontrado",
        //   });
        // }
        // const matricula = await Matricula.findOne({ cid: modulo.cid, uid: uid });
        // if (!matricula) {
        //   return res.status(404).json({
        //     ok: false,
        //     msg: "Matrícula no existe",
        //   });
        // }
        // if (matricula.rol === "Profesor" || matricula.rol === "Ayudante") {
        //   const videos = await Video.find(
        //     { mid: mid },
        //     {
        //       cid: false,
        //       mid: false,
        //       url: false,
        //     }
        //   );
        //   return res.json({
        //     ok: true,
        //     videos,
        //   });
        // }
        // const activos = (await Activo.find({ mid: mid }))
        //   .filter((item) => item.video.activo)
        //   .map((item) => item.sid.toString());
        // const videos = await Video.find(
        //   { sid: { $in: activos } },
        //   {
        //     cid: false,
        //     mid: false,
        //     url: false,
        //   }
        // );
        if (usuario.admin) {
            const videos = yield video_1.default.find({ mid: mid });
            return res.json({
                ok: true,
                videos,
            });
        }
        const videos = yield video_1.default.find({ mid: mid }, {
            cid: false,
            mid: false,
            url: false,
        });
        return res.json({
            ok: true,
            videos,
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
exports.obtenerVideosModulo = obtenerVideosModulo;
const obtenerVideoSeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sid } = req.params;
    try {
        // const video = await Video.findOne({ sid: sid });
        // if (!video) {
        //   return res.json({
        //     ok: false,
        //     msg: "Video no existe",
        //   });
        // }
        // return res.json({
        //   ok: true,
        //   video,
        // });
        const { uid } = req.params;
        const seccion = yield seccion_1.default.findOne({ _id: sid });
        if (!seccion) {
            return res.status(404).json({
                ok: false,
                msg: "Sección no encontrada",
            });
        }
        const matricula = yield matricula_1.default.findOne({ cid: seccion.cid, uid: uid });
        if (!matricula) {
            return res.status(404).json({
                ok: false,
                msg: "Matrícula no existe",
            });
        }
        if (matricula.rol === "Profesor" || matricula.rol === "Ayudante") {
            const video = yield video_1.default.findOne({ sid: sid });
            return res.json({
                ok: true,
                video,
            });
        }
        const activo = yield activo_1.default.findOne({ sid: sid });
        if (activo && activo.video.activo) {
            const video = yield video_1.default.findOne({ sid: sid });
            return res.json({
                ok: true,
                video,
            });
        }
        return res.json({
            ok: false,
            msg: "Video no está activo",
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
exports.obtenerVideoSeccion = obtenerVideoSeccion;
// ADMINISTRADOR
const crearVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const nuevoVideo = new video_1.default(req.body);
        const videoCreado = yield nuevoVideo.save();
        return res.json({
            ok: true,
            msg: "Video creado",
            videoCreado,
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
exports.crearVideo = crearVideo;
const eliminarVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const video = yield video_1.default.findById(id);
        const matricula = yield matricula_1.default.findOne({ uid: uid, cid: video === null || video === void 0 ? void 0 : video.cid });
        if (usuario.admin === false && (matricula === null || matricula === void 0 ? void 0 : matricula.rol) !== "Administrador") {
            return res.status(403).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const videoEliminado = yield video_1.default.findByIdAndDelete(id);
        return res.json({
            ok: true,
            msg: "Video eliminado",
            videoEliminado,
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
exports.eliminarVideo = eliminarVideo;
const editarVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
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
        const { vid, sid, mid, bid, seccion } = req.body;
        const mismoVideoEncontrado = yield video_1.default.findOne({ _id: vid });
        if (!mismoVideoEncontrado) {
            return res.json({
                ok: false,
                msg: "Video no existe",
            });
        }
        const videoEditado = yield video_1.default.findByIdAndUpdate(vid, req.body, {
            new: true,
        });
        return res.json({
            ok: true,
            msg: "Video editada",
            videoEditado,
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
exports.editarVideo = editarVideo;
