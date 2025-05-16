import { Server } from "socket.io";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado: ", socket.id);

    // Escuchar cuando el cliente se une a una sala
    socket.on("unirseSala", (sala) => {
      socket.join(sala);
    });

    // Escuchar cuando se envía un mensaje
    socket.on("mensajeEnviado", (mensaje) => {
      const { remitenteId, receptorId } = mensaje;
      const idsOrdenados = [remitenteId, receptorId].sort((a, b) => a - b);
      const sala = `sala_${idsOrdenados[0]}_${idsOrdenados[1]}`;

      io.to(sala).emit("mensajeRecibido", mensaje);
    });

    socket.on("postEnviado", (post) => {
      io.emit("postRecibido", post);
    });

    socket.on("toggleLikeEnviado", (data) => {
      io.emit("toggleLikeRecibido", data);
    });

    socket.on("comentarioEnviado", (data) => {
      io.emit("comentarioRecibido", data);
    });

    socket.on("disconnect", () => {
      console.log(`Socket desconectado: ${socket.id}`);
    });
  });
};
