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
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../helpers/jwt");
const socket_1 = require("../controllers/socket");
class Sockets {
    constructor(io) {
        this.io = io;
        this.socketsEvents();
    }
    socketsEvents() {
        // On connection
        this.io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
            if (socket.handshake.query["x-token"] === undefined ||
                socket.handshake.query["matricula"] === undefined) {
                console.log("Desconectando usuario");
                return socket.disconnect();
            }
            const tokenEnviado = socket.handshake.query["x-token"].toString();
            const matriculaEnviada = socket.handshake.query["matricula"].toString();
            const [valido, uid] = (0, jwt_1.comprobarJWT)(tokenEnviado);
            if (valido === false) {
                console.log("token no identificado");
                return socket.disconnect();
            }
            const matricula = JSON.parse(matriculaEnviada);
            const payloadConectar = yield (0, socket_1.conectarUsuario)(matricula.mid);
            if (payloadConectar.ok === false) {
                console.log("Usuario no está matriculado");
                return socket.disconnect();
            }
            const sala = `${matricula.cid}${matricula.gid}`;
            socket.join(sala);
            socket.join(uid);
            console.log(`Cliente ${uid} se unió a la sala ${sala}`);
            const payloadUC = yield (0, socket_1.obtenerUsuariosConectados)(matricula.cid, matricula.gid);
            if (payloadUC.ok === false) {
                console.log("Problemas para encontrar usuarios conectados");
                return socket.disconnect();
            }
            this.io.to(sala).emit("usuarios-conectados", payloadUC.payload);
            socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
                yield (0, socket_1.desconectarUsuario)(matricula.mid);
                console.log(`Cliente ${uid} desconectado a la sala ${sala}`);
                const payloadUC = yield (0, socket_1.obtenerUsuariosConectados)(matricula.cid, matricula.gid);
                this.io.to(sala).emit("usuarios-conectados", payloadUC.payload);
            }));
            // TODO: Obtener y Actualizar ejercicios de clase
            socket.on("activo-seccion", (activo) => __awaiter(this, void 0, void 0, function* () {
                // console.log(matricula.rol)
                if (matricula.rol === "Profesor") {
                    const payloadActivo = yield (0, socket_1.ActivoSeccion)(activo);
                    return this.io.to(sala).emit("activo-seccion", payloadActivo.payload);
                }
                this.io.to(sala).emit("activo-seccion", activo);
            }));
            // TODO: Obtener y Actualizar ejercicios de clase
            socket.on("dbq", (activo) => __awaiter(this, void 0, void 0, function* () {
                const payloadActivo = yield (0, socket_1.crearDBQ)(Object.assign(Object.assign({}, activo), { uid: uid }));
                return this.io.to(uid).emit("dbq-cliente", payloadActivo.payload);
            }));
        }));
    }
}
exports.default = Sockets;
