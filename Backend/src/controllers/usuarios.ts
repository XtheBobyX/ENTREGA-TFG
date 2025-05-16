import { Request, Response } from "express";
import { Usuario } from "../models/usuarioM";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";


export const getUsuarios = async (req: Request, res: Response) => {
  const usuarios = await Usuario.findAll();
  res.json({ usuarios });
};

export const getUsuario = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const usuario = await Usuario.findOne({ where: { username } });

    if (!usuario) {
      res.status(404).json({
        msg: `No existe el usuario con el username ${username}`,
      });
      return;
    }
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getUsuarioByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findOne({ where: { id_usuario:id } });

    if (!usuario) {
      res.status(404).json({
        msg: `No existe el usuario con el id ${id}`,
      });
      return;
    }
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const crearUsuario = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, email } = req.body;

  if (!password) {
    res.status(400).json({
      msg: "La contraseña no puede estar vacía",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(`Contraseña hasheada ${hashedPassword}`);

  // Comprobar si existe
  try {
    const emailExisted = await Usuario.findOne({
      where: {
        email,
      },
    });

    const usernameExisted = await Usuario.findOne({
      where: {
        username,
      },
    });

    if (emailExisted) {
      res.status(400).json({
        msg: "Ya existe un usuario con ese e-mail " + email,
      });
      return;
    }

    if (usernameExisted) {
      res.status(400).json({
        msg: "Ya existe un usuario con ese username " + username,
      });
      return;
    }

    const usuario = await Usuario.create({
      username,
      password_hash: hashedPassword,
      email,
    });
    // await usuario.save();
    res.json(usuario);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "ERROR 500 Z",
    });
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      res.status(404).json({ msg: "No existe el usuario con el id " + id });
      return;
    }

    // Actualizacion
    await usuario.update(body);
    res.json(usuario);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "ERROR 500 Z",
    });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  const id = req.params.id;
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    res.status(404).json({ msg: "No existe el usuario con el id " + id });
    return;
  }

  // Eliminacion Fisica (Eliminaccion real)
  await usuario.destroy();
  res.json({
    usuario,
  });

  //Eliminacion Logica (Marcar como borrado)
  // await usuario.update({delete_at: '2025-03-30 16:28:25'})
};

export const loginUser = async function (req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    // Comprobar si existe
    const usuario: any = await Usuario.findOne({
      where: { username: username },
    });

    if (!usuario) {
      res.status(404).json({
        msg: `No existe un usuario con el nombre ${username} en la base de datos`,
      });
      return;
    }

    // Validar contraseña
    const contraseñaValida = await bcrypt.compare(
      password,
      usuario.password_hash
    );

    if (!contraseñaValida) {
      res.status(400).json({
        msg: `Contraseña Incorrecta`,
      });
      return;
    }

    // Generación del Token
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        url_imagen_perfil: usuario.url_imagen_perfil,
        username: username,
      },
      process.env.SECRET_KEY || "nm>)Ys1bNn4#O9kjWhk|r[&0s",
      { expiresIn: "1h" }
    );

    res.json(token);
  } catch (error) {
    console.error("Error durante el login:", error);
    res.status(500).json({
      msg: "Hubo un error al intentar iniciar sesión. Por favor, inténtalo más tarde.",
    });
    return;
  }
};

export const logoutUser = async function (req: Request, res: Response) {
  const token = localStorage.getItem("token");
  if (!token) {
    res.status(401).json({ msg: "No hay sesión iniciada" });
    return;
  }
  // Eliminar el token del localStorage
  localStorage.removeItem("token");
  res.json({ msg: "Sesión cerrada" });
};



export const buscadorUsuario = async (req: Request, res: Response) => {
  const busqueda = (req.query.query as string) || ''; 

  try {
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          {
            username: {
              [Op.like]: `%${busqueda}%` 
            }
          },
          {
            nombre_completo: {
              [Op.like]: `%${busqueda}%` 
            }
          }
        ]
      },
      limit: 20
    });

    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al buscar usuarios' });
  }
};
