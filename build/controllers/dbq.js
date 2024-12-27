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
exports.crearDBQ = exports.obtenerDBQQuestion = exports.obtenerDBQSModulo = void 0;
const dbq_1 = __importDefault(require("../models/dbq"));
const mongoose_1 = __importDefault(require("mongoose"));
const obtenerDBQSModulo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, mid } = req.params;
    try {
        // const dbqs = await DBQ.find({ mid: mid, uid: uid }).sort({ 'fecha': -1 });
        const ObjectId = mongoose_1.default.Types.ObjectId;
        const dbqs = yield dbq_1.default.aggregate([
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
                    _id: "$qid",
                    id: { $first: "$_id" },
                    fecha: { $first: "$fecha" },
                    cid: { $first: "$cid" },
                    mid: { $first: "$mid" },
                    bid: { $first: "$bid" },
                    sid: { $first: "$sid" },
                    qid: { $first: "$qid" },
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
            msg: "dbqs estudiante",
            dbqs,
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
exports.obtenerDBQSModulo = obtenerDBQSModulo;
const obtenerDBQQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, qid } = req.params;
    try {
        const dbq = yield dbq_1.default.findOne({ uid: uid, qid: qid }).sort({ fecha: -1 });
        return res.json({
            ok: true,
            msg: "dbq estudiante",
            dbq,
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
exports.obtenerDBQQuestion = obtenerDBQQuestion;
const crearDBQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const { cid, mid, bid, sid, qid, respuesta, estado } = req.body;
        const nuevoDBQ = new dbq_1.default({
            cid: cid,
            mid: mid,
            bid: bid,
            sid: sid,
            qid: qid,
            uid: uid,
            fecha: new Date(),
            respuesta: respuesta,
            estado: estado,
        });
        const dbqCreado = yield nuevoDBQ.save();
        return res.json({
            ok: true,
            msg: "DBQ creado",
            dbqCreado,
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
exports.crearDBQ = crearDBQ;
// ADMINISTRADOR
