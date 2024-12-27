"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Server Model: Contiene todo el servidor de express + socket.io configurado
const server_1 = __importDefault(require("./server/server"));
// Inicializar la instancia del server
const server = new server_1.default();
// Ejecutar el server
server.execute();
