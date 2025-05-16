import { Request, Response } from "express";
import { Mensaje } from "../models/mensajeM";
import { Usuario } from "../models/usuarioM";
import { Op } from "sequelize";

export const getConversaciones = async (req: Request, res: Response) => {
  const { idUsuario } = req.params;

  try {
    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [{ id_remitente: idUsuario }, { id_receptor: idUsuario }],
      },
      include: [
        {
          model: Usuario,
          as: "remitente",
          attributes: [
            "id_usuario",
            "username",
            "nombre_completo",
            "url_imagen_perfil",
          ],
        },
        {
          model: Usuario,
          as: "receptor",
          attributes: [
            "id_usuario",
            "username",
            "nombre_completo",
            "url_imagen_perfil",
          ],
        },
      ],
    });
    res.json({ mensajes });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener los mensajes", error });
  }
};
// Enviar Mensaje
export const enviarMensaje = async (req: Request, res: Response) => {
  const { remitenteId, receptorId, contenido } = req.body;

  if (!contenido || contenido.trim() === "") {
    res.status(400).json({ msg: "El mensaje no puede estar vacío", contenido });
    return;
  }

  try {
    const nuevoMensaje = await Mensaje.create({
      id_remitente: remitenteId,
      id_receptor: receptorId,
      contenido,
    });
    
    res.status(201).json({
      mensaje: nuevoMensaje,
      msg: "Enviado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al enviar el mensaje", error });
  }
};

// Obtener historial entre dos usuarios
export const obtenerMensajes = async (req: Request, res: Response) => {
  const { usuario1, usuario2 } = req.body;

  try {
    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [
          { id_remitente: usuario1, id_receptor: usuario2 },
          { id_remitente: usuario2, id_receptor: usuario1 },
        ],
      },
      order: [["created_at", "ASC"]],
      include: [
        {
          model: Usuario,
          as: "remitente",
          attributes: [
            "id_usuario",
            "username",
            "nombre_completo",
            "url_imagen_perfil",
          ],
        },
        {
          model: Usuario,
          as: "receptor",
          attributes: [
            "id_usuario",
            "username",
            "nombre_completo",
            "url_imagen_perfil",
          ],
        },
      ],
    });
    res.json(mensajes);
  } catch (error) {}
};
