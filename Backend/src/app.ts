import dotenv from "dotenv";
import "./models/initModels.js";
import MyServer from "./server.js";

dotenv.config();

const server = new MyServer();
server.listen();
