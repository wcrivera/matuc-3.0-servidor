// Server Model: Contiene todo el servidor de express + socket.io configurado
import Server from './server/server';
// Inicializar la instancia del server
const server = new Server();
// Ejecutar el server
server.execute();
