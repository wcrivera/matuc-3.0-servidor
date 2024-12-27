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
exports.editarActivo = exports.crearActivo = exports.obtenerActivoSeccion = exports.obtenerActivosModulo = void 0;
const activo_1 = __importDefault(require("../models/activo"));
// import Usuario from "../models/usuario";
const matricula_1 = __importDefault(require("../models/matricula"));
const obtenerActivosModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mid } = req.params;
    try {
        const activos = yield activo_1.default.find({ mid: mid });
        return res.json({
            ok: true,
            activos,
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
exports.obtenerActivosModulo = obtenerActivosModulo;
const obtenerActivoSeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sid } = req.params;
    try {
        const activo = yield activo_1.default.findOne({ sid: sid });
        console.log(activo);
        if (!activo) {
            return res.status(404).json({
                ok: false,
                msg: "activo no encontrado",
            });
        }
        return res.json({
            ok: true,
            activo,
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
exports.obtenerActivoSeccion = obtenerActivoSeccion;
// PROFESOR
const crearActivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gid, cid, mid, bid, sid } = req.body;
        const activoquestion = yield activo_1.default.findOne({
            cid: cid,
            gid: gid,
            mid: mid,
            bid: bid,
            sid: sid,
        });
        // console.log(activoquestion);
        if (activoquestion) {
            // return res.status(404).json({
            //   ok: false,
            //   msg: "Ya existe este dato",
            // });
            console.log(activoquestion);
            return res.json({
                ok: false,
                msg: "Ya existe este dato",
                activoCreado: activoquestion,
            });
        }
        const { uid } = req.params;
        // const matricula = await Matricula.findOne({ cid: cid, gid: gid, uid: uid });
        const matricula = yield matricula_1.default.findOne({ cid: cid, gid: gid, uid: uid });
        if (!matricula) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no matriculado",
            });
        }
        if (matricula.rol !== "Profesor") {
            return res.status(404).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const nuevoActivo = new activo_1.default(req.body);
        const activoCreado = yield nuevoActivo.save();
        return res.json({
            ok: true,
            msg: "Activo creado",
            activoCreado,
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
exports.crearActivo = crearActivo;
const editarActivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gid, cid, mid, bid, sid } = req.body;
        const { uid } = req.params;
        const matricula = yield matricula_1.default.findOne({ cid: cid, gid: gid, uid: uid });
        if (!matricula) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no matriculado",
            });
        }
        if (matricula.rol !== "Profesor") {
            return res.status(404).json({
                ok: false,
                msg: "Usuario sin permiso",
            });
        }
        const activo = yield activo_1.default.findOne({
            cid: cid,
            gid: gid,
            mid: mid,
            bid: bid,
            sid: sid,
        });
        if (!activo) {
            return res.json({
                ok: false,
                msg: "Activo no existe",
            });
        }
        const activoEditado = yield activo_1.default.findByIdAndUpdate(activo.id, req.body, {
            new: true,
        });
        return res.json({
            ok: true,
            msg: "Activo editado",
            activoEditado,
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
exports.editarActivo = editarActivo;
