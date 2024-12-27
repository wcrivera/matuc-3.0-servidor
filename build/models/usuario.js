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
const UsuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    apellido: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: false,
        trim: true,
    },
    activo: {
        type: Boolean,
        required: true,
        default: false,
    },
    admin: {
        type: Boolean,
        required: true,
        default: false,
    },
});
UsuarioSchema.method("toJSON", function () {
    const _a = this.toObject(), { _id } = _a, object = __rest(_a, ["_id"]);
    object.uid = _id;
    return object;
});
exports.default = (0, mongoose_1.model)("Usuario", UsuarioSchema);
