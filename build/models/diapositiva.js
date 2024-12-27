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
const Diapositiva = new mongoose_1.Schema({
    pagina: {
        type: Number,
        required: false,
        trim: true,
    },
    contenido: {
        type: String,
        required: false,
        trim: true,
    },
});
const DiapositivaSchema = new mongoose_1.Schema({
    cid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Curso",
    },
    mid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Modulo",
    },
    bid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Bloque",
    },
    sid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Seccion",
        unique: true,
    },
    autor: {
        type: String,
        required: true,
        trim: true,
    },
    diapositivas: {
        type: Array(),
        default: [{ pagina: 1, contenido: "" }],
        trim: true,
    },
    publico: {
        type: Boolean,
        default: true
    }
});
DiapositivaSchema.method("toJSON", function () {
    const _a = this.toObject(), { _id } = _a, object = __rest(_a, ["_id"]);
    object.did = _id;
    return object;
});
exports.default = (0, mongoose_1.model)("Diapositiva", DiapositivaSchema);
