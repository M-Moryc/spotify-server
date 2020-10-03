import http from 'http';
const server = http.Server();
import socketio from 'socket.io';
const io = socketio(server);
import connectSocket from 'spotify-connect-ws';
server.listen(8080);
io.on("connection", connectSocket.default);

export default {io};
