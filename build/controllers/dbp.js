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
exports.crearDBP = exports.obtenerDBPSModulo = void 0;
const dbp_1 = __importDefault(require("../models/dbp"));
const mongoose_1 = __importDefault(require("mongoose"));
const obtenerDBPSModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, mid } = req.params;
    try {
        const ObjectId = mongoose_1.default.Types.ObjectId;
        const dbps = yield dbp_1.default.aggregate([
            {
                $match: {
                    mid: new ObjectId(mid),
                    uid: new ObjectId(uid),
                },
            },
            {
                $sort: {
                    fecha: -1,
                },
            },
            {
                $group: {
                    _id: "$pid",
                    id: { $first: "$_id" },
                    fecha: { $first: "$fecha" },
                    cid: { $first: "$cid" },
                    mid: { $first: "$mid" },
                    pid: { $first: "$pid" },
                    respuesta: { $first: "$respuesta" },
                    estado: { $first: "$estado" },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]);
        return res.json({
            ok: true,
            msg: "dbps estudiante",
            dbps,
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
exports.obtenerDBPSModulo = obtenerDBPSModulo;
const crearDBP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const { cid, mid, pid, respuesta, estado } = req.body;
        const nuevoDBP = new dbp_1.default({
            cid: cid,
            mid: mid,
            pid: pid,
            uid: uid,
            fecha: new Date(),
            respuesta: respuesta,
            estado: estado,
        });
        const dbpCreado = yield nuevoDBP.save();
        return res.json({
            ok: true,
            msg: "DBP creado",
            dbpCreado,
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
exports.crearDBP = crearDBP;
// ADMINISTRADOR
