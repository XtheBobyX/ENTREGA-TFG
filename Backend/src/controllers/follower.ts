import { Request, Response } from "express";
import { Follow } from "../models/followM";
import { Sequelize } from "sequelize";
import {Usuario} from "../models/usuarioM";


export const toggleFollow = async (req: Request, res: Response) => {
  const { id: idSeguidor } = req.params;
  const { userIdSeguidor } = req.body;

  try {
    // comprobaciones usuario
    const existedFollow = await Follow.findOne({
      where: { id_seguidor: idSeguidor, id_seguido: userIdSeguidor },
    });
    //
    if (existedFollow) {
      await existedFollow.destroy();
      res.json({ followed: false, msg: "Follow eliminado" });
    } else {
      await Follow.create({
        id_seguidor: idSeguidor,
        id_seguido: userIdSeguidor,
      });
      res.json({ followed: true, msg: "Follow agregado" });
      return;
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al alternar el follow", error });
  }
};

export const getFollowStatus = async (req: Request, res: Response) => {
  const { idSeguidor, idSeguido } = req.params;
  try {
    const follow = await Follow.findOne({
      where: { id_seguidor: idSeguidor, id_seguido: idSeguido },
    });
    res.json({ followed: !!follow });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener estado de follow", error });
  }
};

export const getSeguidores = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { count: numeroSeguidores } = await Follow.findAndCountAll({
      where: { id_seguido: id },
    });
    res.json({numSeguidores: numeroSeguidores});
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al contar el número de seguidores", error });
  }
};
export const getSeguido = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { count: numeroSeguido } = await Follow.findAndCountAll({
      where: { id_seguidor: id },
    });
    res.json({numSeguido: numeroSeguido});
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al contar el número de seguidos", error });
  }
};
export const topSeguidores = async (req: Request, res: Response) => {
  try {
    const usuariosMasSeguidos = await Follow.findAll({
      attributes: [
        "id_seguido",
        [Sequelize.fn("COUNT", Sequelize.col("id_seguidor")), "cantidadSeguidores"]
      ],
      include: [
        {
          model: Usuario,
          as: "usuarioSeguido",
          attributes: ["id_usuario", "username", "nombre_completo","url_imagen_perfil"] 
        }
      ],
      group: ["id_seguido", "usuarioSeguido.id_usuario"],
      order: [[Sequelize.literal("cantidadSeguidores"), "DESC"]],
      limit: 5,
    });

    res.json({ top: usuariosMasSeguidos });
  } catch (error) {
    res.status(500).json({ msg: "Error al mostrar top seguidores", error });
  }
};