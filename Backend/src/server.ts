import express, { Application } from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import logger from "morgan";

import userRoutes from "./routes/usuario";
import postRoutes from "./routes/post";
import followRoutes from "./routes/follow";
import mensajesRouter from "./routes/mensajes";

import cors from "cors";
import db from "./db/connection";

import { socketHandler } from "./sockets/socket";

class MyServer {
  private app: Application;
  private port: string;
  private server: import("http").Server;
  private io: any;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, { cors: { origin: "*" } });

    this.app.use(logger("dev"));
    this.port = process.env.PORT || "3000";
    console.log(this.port);

    this.dbConnection();
    this.middlewares();
    this.routes();

    socketHandler(this.io);
  }

  private apiPaths = {
    usuarios: "/api/usuarios",
    posts: "/api/posts",
    follow: "/api/toggle-follow",
    upload: "/api/upload",
    mensajes: "/api/mensajes",
  };

  async dbConnection() {
    try {
      await db.authenticate();
      console.log("Base de datos: ON");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error de conexión a la base de datos:", error);
        process.exit(1);
      }
    }
  }

  middlewares() {
    //CORS
    this.app.use(cors());
    // Leer body
    this.app.use(express.json());
    //Carpeta publica
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.apiPaths.usuarios, userRoutes);
    this.app.use(this.apiPaths.posts, postRoutes);
    this.app.use(this.apiPaths.follow, followRoutes);
    this.app.use(this.apiPaths.mensajes, mensajesRouter);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Servidor levantado en el puerto " + this.port);
    });
  }
}

export default MyServer;
