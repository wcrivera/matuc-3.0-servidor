import { Server as WebSocketServer } from "socket.io";
import { comprobarJWT } from "../helpers/jwt";
import {
  ActivoSeccion,
  conectarUsuario,
  crearDBQ,
  desconectarUsuario,
  obtenerUsuariosConectados,
} from "../controllers/socket";

export default class Sockets {
  io: WebSocketServer;

  constructor(io: WebSocketServer) {
    this.io = io;
    this.socketsEvents();
  }

  socketsEvents() {
    // On connection
    this.io.on("connection", async (socket) => {
      if (
        socket.handshake.query["x-token"] === undefined ||
        socket.handshake.query["matricula"] === undefined
      ) {
        console.log("Desconectando usuario");
        return socket.disconnect();
      }

      const tokenEnviado = socket.handshake.query["x-token"].toString();
      const matriculaEnviada = socket.handshake.query["matricula"].toString();

      const [valido, uid] = comprobarJWT(tokenEnviado);

      if (valido === false) {
        console.log("token no identificado");
        return socket.disconnect();
      }

      const matricula = JSON.parse(matriculaEnviada);

      const payloadConectar = await conectarUsuario(matricula.mid);

      if (payloadConectar.ok === false) {
        console.log("Usuario no está matriculado");
        return socket.disconnect();
      }

      const sala = `${matricula.cid}${matricula.gid}`;

      socket.join(sala);
      socket.join(uid);

      console.log(`Cliente ${uid} se unió a la sala ${sala}`);

      const payloadUC = await obtenerUsuariosConectados(
        matricula.cid,
        matricula.gid
      );

      if (payloadUC.ok === false) {
        console.log("Problemas para encontrar usuarios conectados");
        return socket.disconnect();
      }

      this.io.to(sala).emit("usuarios-conectados", payloadUC.payload);

      socket.on("disconnect", async () => {
        await desconectarUsuario(matricula.mid);
        console.log(`Cliente ${uid} desconectado a la sala ${sala}`);

        const payloadUC = await obtenerUsuariosConectados(
          matricula.cid,
          matricula.gid
        );
        this.io.to(sala).emit("usuarios-conectados", payloadUC.payload);
      });

      // TODO: Obtener y Actualizar ejercicios de clase
      socket.on("activo-seccion", async (activo) => {
        // console.log(matricula.rol)
        if (matricula.rol === "Profesor") {
          const payloadActivo = await ActivoSeccion(activo);
          return this.io.to(sala).emit("activo-seccion", payloadActivo.payload);
        }

        this.io.to(sala).emit("activo-seccion", activo);
      });

      // TODO: Obtener y Actualizar ejercicios de clase
      socket.on("dbq", async (activo) => {
        const payloadActivo = await crearDBQ({ ...activo, uid: uid });
        return this.io.to(uid).emit("dbq-cliente", payloadActivo.payload);
      });
    });
  }
}
