"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    PORT: process.env.PORT || '8080',
    DB_CNN_STRING: process.env.DB_CNN_STRING || "admin",
    SECRET_JWT_SEED_CLIENTE: process.env.SECRET_JWT_SEED_CLIENTE || "cliente",
    SECRET_JWT_SEED_PIMU: process.env.SECRET_JWT_SEED_PIMU || "pimu",
    SECRET_JWT_SEED_ADMIN: process.env.SECRET_JWT_SEED_ADMIN || "admin",
    SECRET_JWT_SEED_USER_MAIL: process.env.SECRET_JWT_SEED_USER_MAIL || "mail",
    SECRET_JWT_SEED_PASS_MAIL: process.env.SECRET_JWT_SEED_PASS_MAIL || "pass"
};
