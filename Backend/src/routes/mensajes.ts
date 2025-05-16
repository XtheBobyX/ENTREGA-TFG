import { Router } from "express";
import { enviarMensaje, getConversaciones, obtenerMensajes } from "../controllers/mensajes";

const router = Router();

router.post("/mensajes", obtenerMensajes);
router.post("/enviar", enviarMensaje);
router.get('/conversaciones/:idUsuario',getConversaciones)
export default router;
