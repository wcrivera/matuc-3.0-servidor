import { Server as WebSocketServer } from "socket.io";
import { dbConnection } from "../database/database";

import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import fileupload from "express-fileupload";
import config from "../config";
import Socket from "../socket/socket";


import usuarioRoutes from "../routes/usuario";
import cursoRoutes from "../routes/curso";
import matriculaRoutes from "../routes/matricula";
import grupoRoutes from "../routes/grupo";
import moduloRoutes from "../routes/modulo";
import noticiaRoutes from "../routes/noticia";

import ayudantiaRoutes from "../routes/ayudantia";
import ejercicioRoutes from "../routes/ejercicio";
import preguntaRoutes from "../routes/pregunta";

import bloqueRoutes from "../routes/bloque";
import seccionRoutes from "../routes/seccion";

import diapositivaRoutes from "../routes/diapositiva";
import videoRoutes from "../routes/video";
import questionRoutes from "../routes/question";

import dbpRoutes from "../routes/dbp";
import dbqRoutes from "../routes/dbq";

import activoRoutes from "../routes/activo";

import estadisticaRoutes from "../routes/estadistica";

export default class Server {
  app: express.Express;
  port: String;
  server: http.Server;
  io: WebSocketServer;
  sockets: Socket;

  constructor() {
    this.app = express();
    this.port = config.PORT;

    // Conectar a DB
    dbConnection();

    // Http server
    this.server = http.createServer(this.app);

    // Configuración del socket
    this.io = new WebSocketServer(this.server, {
      /* Configuraciones */
    });

    // inicializar sockets
    this.sockets = new Socket(this.io);
  }

  middlewares() {
    // Desplegar el directorio público
    this.app.use(express.static(path.resolve(__dirname, "../public")));

    // TODO: CORS
    this.app.use(
      cors({
        origin: "*",
      })
    );

    // Parseo del body
    this.app.use(express.json());

    // Subir archivo
    this.app.use(fileupload({
      createParentPath: true
    }))

    // API ENDPoints

    this.app.use("/api/usuario", usuarioRoutes);
    this.app.use("/api/curso", cursoRoutes);
    this.app.use("/api/grupo", grupoRoutes);
    this.app.use("/api/matricula", matriculaRoutes);
    this.app.use("/api/modulo", moduloRoutes);
    this.app.use("/api/noticia", noticiaRoutes);

    this.app.use("/api/ayudantia", ayudantiaRoutes);
    this.app.use("/api/ejercicio", ejercicioRoutes);
    this.app.use("/api/pregunta", preguntaRoutes);

    this.app.use("/api/bloque", bloqueRoutes);
    this.app.use("/api/seccion", seccionRoutes);

    this.app.use("/api/diapositiva", diapositivaRoutes);
    this.app.use("/api/video", videoRoutes);
    this.app.use("/api/question", questionRoutes);

    this.app.use("/api/dbp", dbpRoutes);
    this.app.use("/api/dbq", dbqRoutes);

    this.app.use("/api/activo", activoRoutes);

    this.app.use("/api/estadistica", estadisticaRoutes);
    
  }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    // Inicializar Server
    this.server.listen(this.port, () => {
      console.log("Servidor en puerto", this.port);
    });
  }
}
