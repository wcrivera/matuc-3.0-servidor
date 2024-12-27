"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DBQSchema = new mongoose_1.Schema({
    cid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Curso",
        required: true,
    },
    mid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Modulo",
        required: true,
    },
    bid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Bloque",
        required: true,
    },
    sid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Seccion",
        required: true,
    },
    qid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    uid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    fecha: {
        type: Date,
        default: new Date(),
    },
    respuesta: {
        type: String,
        required: true,
        trim: true,
    },
    estado: {
        type: Boolean,
        required: true,
        trim: true,
    },
});
DBQSchema.method("toJSON", function () {
    const _a = this.toObject(), { _id } = _a, object = __rest(_a, ["_id"]);
    object.id = _id;
    return object;
});
exports.default = (0, mongoose_1.model)("DBQ", DBQSchema);
