"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const database_1 = require("../database/database");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const config_1 = __importDefault(require("../config"));
const socket_1 = __importDefault(require("../socket/socket"));
const usuario_1 = __importDefault(require("../routes/usuario"));
const curso_1 = __importDefault(require("../routes/curso"));
const matricula_1 = __importDefault(require("../routes/matricula"));
const grupo_1 = __importDefault(require("../routes/grupo"));
const modulo_1 = __importDefault(require("../routes/modulo"));
const noticia_1 = __importDefault(require("../routes/noticia"));
const ayudantia_1 = __importDefault(require("../routes/ayudantia"));
const ejercicio_1 = __importDefault(require("../routes/ejercicio"));
const pregunta_1 = __importDefault(require("../routes/pregunta"));
const bloque_1 = __importDefault(require("../routes/bloque"));
const seccion_1 = __importDefault(require("../routes/seccion"));
const diapositiva_1 = __importDefault(require("../routes/diapositiva"));
const video_1 = __importDefault(require("../routes/video"));
const question_1 = __importDefault(require("../routes/question"));
const dbp_1 = __importDefault(require("../routes/dbp"));
const dbq_1 = __importDefault(require("../routes/dbq"));
const activo_1 = __importDefault(require("../routes/activo"));
const estadistica_1 = __importDefault(require("../routes/estadistica"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.default.PORT;
        // Conectar a DB
        (0, database_1.dbConnection)();
        // Http server
        this.server = http_1.default.createServer(this.app);
        // Configuración del socket
        this.io = new socket_io_1.Server(this.server, {
        /* Configuraciones */
        });
        // inicializar sockets
        this.sockets = new socket_1.default(this.io);
    }
    middlewares() {
        // Desplegar el directorio público
        this.app.use(express_1.default.static(path_1.default.resolve(__dirname, "../public")));
        // TODO: CORS
        this.app.use((0, cors_1.default)({
            origin: "*",
        }));
        // Parseo del body
        this.app.use(express_1.default.json());
        // Subir archivo
        this.app.use((0, express_fileupload_1.default)({
            createParentPath: true
        }));
        // API ENDPoints
        this.app.use("/api/usuario", usuario_1.default);
        this.app.use("/api/curso", curso_1.default);
        this.app.use("/api/grupo", grupo_1.default);
        this.app.use("/api/matricula", matricula_1.default);
        this.app.use("/api/modulo", modulo_1.default);
        this.app.use("/api/noticia", noticia_1.default);
        this.app.use("/api/ayudantia", ayudantia_1.default);
        this.app.use("/api/ejercicio", ejercicio_1.default);
        this.app.use("/api/pregunta", pregunta_1.default);
        this.app.use("/api/bloque", bloque_1.default);
        this.app.use("/api/seccion", seccion_1.default);
        this.app.use("/api/diapositiva", diapositiva_1.default);
        this.app.use("/api/video", video_1.default);
        this.app.use("/api/question", question_1.default);
        this.app.use("/api/dbp", dbp_1.default);
        this.app.use("/api/dbq", dbq_1.default);
        this.app.use("/api/activo", activo_1.default);
        this.app.use("/api/estadistica", estadistica_1.default);
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
exports.default = Server;
