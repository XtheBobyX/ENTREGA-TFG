import { Request, Response } from "express";
import { Usuario } from "../models/usuarioM";
import { Post } from "../models/postM";
import { Multimedia } from "../models/ImagenM";
import { Encuesta } from "../models/encuestas/encuestaM";
import { OpcionEncuesta } from "../models/encuestas/opcionesEncuestaM";
import { VotosEncuesta } from "../models/encuestas/votosEncuestaM";
import { Like } from "../models/likeM";
import { Comentario } from "../models/comentarioM";
import { Repost } from "../models/repostM";
import { Save } from "../models/guardarPostM";
import { Hashtag } from "../models/hashtagsM";
import { HashtagPost } from "../models/hashtagsPostM";
import extractHashtags from "../utils/extractHashtags";
import { Sequelize } from "sequelize";

export const getPosts = async (req: Request, res: Response) => {
  try {
    // Obtener el username desde la consulta
    const username = req.query.username as string;
    //  $usuario.username$ para las relaciones
    const whereCondition = username ? { "$usuario.username$": username } : {};

    const posts = await Post.findAll({
      where: whereCondition,
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: [
            "id_usuario",
            "username",
            "email",
            "url_imagen_perfil",
            "nombre_completo",
            "portada",
          ],
        },
        {
          model: Multimedia,
          attributes: ["post_id", "id_usuario", "tipo_archivo", "url_archivo"],
        },
        {
          model: Encuesta,
          attributes: ["titulo", "id_encuesta", "post_id", "multiple_opciones"],
          include: [
            {
              model: OpcionEncuesta,
              attributes: ["id_opcion", "id_encuesta", "texto_opcion"],
            },
          ],
        },
      ],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      msg: "ERROR 500: Error al obtener los posts",
    });
  }
};

/**
 * @function getPost
 * @description Obtiene un post específico de la base de datos por su ID, junto con los detalles del usuario asociado.
 *
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 * @param {string} req.params.id - El ID del post a obtener.
 *
 * @returns {Response} Devuelve el post con los detalles del usuario asociado.
 *
 * @throws {404} Si no se encuentra un post con el ID proporcionado.
 * @throws {500} Si ocurre un error en la base de datos o en la ejecución.
 */
export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: [
            "id_usuario",
            "username",
            "nombre_completo",
            "url_imagen_perfil",
          ],
        },
        {
          model: Multimedia,
          attributes: ["post_id", "id_usuario", "tipo_archivo", "url_archivo"],
        },
        {
          model: Encuesta,
          attributes: ["titulo", "id_encuesta", "post_id", "multiple_opciones"],
          include: [
            {
              model: OpcionEncuesta,
              attributes: ["texto_opcion"],
            },
          ],
        },
      ],
    });
    if (!post) {
      res.status(404).json({ msg: `No existe el post con el id ${id}` });
      return;
    }
    res.json(post);
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      msg: "ERROR 500: Error al obtener el post",
    });
  }
};

/**
 * @function crearPost
 * @description Crea un nuevo post en la base de datos.
 *
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 * @param {Object} req.body - El cuerpo de la solicitud contiene los datos del post a crear.
 * @param {string} req.id - El ID del post.
 * @param {string} req.content - El contenido del post.
 * @param {number} req.usuarioId - El ID del usuario asociado al post.
 *
 * @returns {Response} Devuelve el post recién creado.
 *
 * @throws {400} Si ya existe un post con el ID proporcionado.
 * @throws {500} Si ocurre un error en la base de datos o en la ejecución.
 */
export const crearPost = async (req: Request, res: Response) => {
  const { contenido, id_usuario, encuesta, hashtags, imagenes, tipo_archivo } =
    req.body;

  try {
    // Crear el post
    const post: any = await Post.create({ contenido, id_usuario });
    // Obtener usuario
    const usuario: any = await Usuario.findByPk(id_usuario);
    // Extraer hashtags
    const hashtagsExtraidos = hashtags || extractHashtags(contenido);

    for (let hashtag of hashtagsExtraidos) {
      const hashtagText = hashtag.slice(1).toLowerCase(); // Extraer el hashtag sin el '#'

      let existingHashtag: any;

      try {
        // Intentar crear el hashtag o encontrarlo si ya existe
        const [hashtagRecord] = await Hashtag.findOrCreate({
          where: { hashtag: hashtagText },
          defaults: { hashtag: hashtagText },
        });

        existingHashtag = hashtagRecord;
      } catch (error: any) {
        if (error.name === "SequelizeUniqueConstraintError") {
          // Si ocurre un error de restricción única (ya existe el hashtag), buscamos el hashtag
          existingHashtag = await Hashtag.findOne({
            where: { hashtag: hashtagText },
          });
        } else {
          // Si es otro tipo de error, lo lanzamos
          throw error;
        }
      }

      // Crear la relación entre el post y el hashtag
      await HashtagPost.create({
        post_id: post.post_id,
        id_hashtag: existingHashtag.id_hashtag,
      });
    }

    // Si hay imágenes, guardarlas en la base de datos de multimedia
    let multimediaGuardadas = [];
    if (imagenes && imagenes.length > 0) {
      multimediaGuardadas = await Promise.all(
        imagenes.map(async (img: string) => {
          const multimediaData = {
            post_id: post.post_id,
            id_usuario: id_usuario,
            tipo_archivo: tipo_archivo || "img/png",
            url_archivo: img,
          };

          return await Multimedia.create(multimediaData);
        })
      );
    }
    //
    let nuevaEncuesta: any = null;
    let opcionesEncuesta: any[] = [];
    // Si hay encuesta, crear la encuesta y sus opciones
    if (encuesta) {
      const encuestaData = {
        titulo: encuesta.titulo,
        post_id: post.post_id,
        expira_en: encuesta.expira_en,
        multiple_opciones: encuesta.multiple_opciones,
      };

      nuevaEncuesta = await Encuesta.create(encuestaData);
      // Crear las opciones de la encuesta si se proporcionan
      if (encuesta.opciones && encuesta.opciones.length > 0) {
        opcionesEncuesta = await Promise.all(
          encuesta.opciones.map(async (opcionTexto: string) => {
            const opcionData = {
              id_encuesta: nuevaEncuesta.id_encuesta,
              texto_opcion: opcionTexto,
            };
            return await OpcionEncuesta.create(opcionData);
          })
        );
      }
    }

    const encuestaArray = nuevaEncuesta ? [nuevaEncuesta] : [];

    // Respuesta exitosa
    res.status(201).json({
      post_id: post.post_id,
      id_usuario: post.id_usuario,
      contenido: post.contenido,
      created_at: post.created_at,
      updated_at: post.updated_at,
      is_repost: false,
      usuario: {
        username: usuario.username,
        nombre_completo: usuario.nombre_completo,
        url_imagen_perfil: usuario.url_imagen_perfil,
      },
      Multimedia: multimediaGuardadas,
      Encuesta: nuevaEncuesta
        ? [
            {
              ...nuevaEncuesta.toJSON(),
              OpcionEncuesta: opcionesEncuesta,
            },
          ]
        : [],
    });
  } catch (error) {
    console.error("Error al crear el post:", error);
    res.status(500).json({
      msg: "ERROR 500: Error al crear el post o multimedia",
      error,
    });
  }
};

/**
 * @function actualizarPost
 * @description Actualiza un post existente por su ID.
 *
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 * @param {string} req.params.id - El ID del post a actualizar.
 * @param {Object} req.body - Los datos a actualizar.
 *
 * @returns {Response} Devuelve el post actualizado.
 *
 * @throws {404} Si no se encuentra el post con el ID proporcionado.
 * @throws {500} Si ocurre un error en la base de datos o en la ejecución.
 */
export const actualizarPost = async (req: Request, res: Response) => {
  const { body } = req;
  const id = req.params.id;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ msg: `No existe el post con el id ${id}` });
      return;
    }

    // Actualización
    await post.update(body);
    res.json(post);
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      msg: "ERROR 500: Error al actualizar el post",
    });
  }
};

/**
 * @function deletePost
 * @description Elimina un post de la base de datos por su ID.
 *
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 * @param {string} req.params.id - El ID del post a eliminar.
 *
 * @returns {Response} Devuelve el post eliminado.
 *
 * @throws {404} Si no se encuentra el post con el ID proporcionado.
 * @throws {500} Si ocurre un error en la base de datos o en la ejecución.
 */
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ msg: `No existe el post con el id ${id}` });
      return;
    }
    await post.destroy();
    res.json(post);
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      msg: "ERROR 500: Error al eliminar el post",
    });
  }
};

// dar like
export const toggleLike = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      console.log("Post no encontrado");
      res.status(404).json({ msg: `No existe el post con el id ${id}` });
      return;
    }

    const existingLike = await Like.findOne({
      where: { id_usuario: userId, post_id: id },
    });

    console.log("Existing like:", existingLike);

    if (existingLike) {
      await existingLike.destroy();
      res.json({ liked: false, msg: "Like eliminado" });
      return;
    } else {
      await Like.create({ id_usuario: userId, post_id: id });
      res.json({ liked: true, msg: "Like agregado" });
      return;
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al alternar el like", error });
  }
};

export const toggleGuardarPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userIdSeguidor } = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ msg: `No existe el post con el id ${id}` });
      return;
    }

    // Comprobar si el post ya está guardado por el usuario
    const existingSave = await Save.findOne({
      where: { id_usuario: userIdSeguidor, post_id: id },
    });

    if (existingSave) {
      await existingSave.destroy();
      res.json({ saved: false, msg: "Post No guardado" });
      console.log("Post no guardado");
      return;
    } else {
      await Save.create({ id_usuario: userIdSeguidor, post_id: id });
      res.json({ saved: true, msg: "Post Guardado" });
      console.log("Post guardado");
      return;
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al alternar el guardado", error });
  }
};

export const obtenerNumeroLikes = async (req: Request, res: Response) => {
  const { idPost } = req.params;
  const { userId } = req.query;

  try {
    const post = await Post.findByPk(idPost);
    if (!post) {
      res.status(404).json({ msg: `No existe el post con el id ${idPost}` });
      return;
    }

    // Obtener el número de likes para ese post
    const { count: numeroLikes } = await Like.findAndCountAll({
      where: { post_id: idPost },
    });

    // Comprobar si el usuario ha dado like
    const usuarioHaDadoLike = await Like.findOne({
      where: { post_id: idPost, id_usuario: userId },
    });
    const liked = usuarioHaDadoLike !== null;

    res.json({ likes: numeroLikes, liked });
  } catch (error) {
    res.status(500).json({ msg: "Error al contar el número de likes", error });
  }
};

export const obtenerNumeroComentarios = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ msg: `No existe el post con el id ${id}` });
      return;
    }

    const { count: numeroComentarios } = await Comentario.findAndCountAll({
      where: { post_id: id },
    });
    res.json({ comments: numeroComentarios });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al contar el número de comentarios", error });
  }
};

export const obtenerNumeroReposts = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ msg: `No existe el post con el id ${id}` });
      return;
    }

    const { count: numeroReposts } = await Repost.findAndCountAll({
      where: { post_id: id },
    });
    res.json({ repost: numeroReposts });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al contar el número de reposts", error });
  }
};

export const savedPost = async (req: Request, res: Response) => {
  // TODO: Quizas añadir paginacion const { userId, page = 1, limit = 10 } = req.query; // Paginación

  const { userId } = req.params;
  try {
    const savedPosts = await Save.findAll({
      where: { id_usuario: userId },
      include: [
        {
          model: Post,
          as: "post",
          include: [
            {
              model: Usuario,
              as: "usuario",
              attributes: [
                "id_usuario",
                "username",
                "email",
                "url_imagen_perfil",
                "nombre_completo",
                "portada",
              ],
            },
            {
              model: Multimedia,
              attributes: [
                "post_id",
                "id_usuario",
                "tipo_archivo",
                "url_archivo",
              ],
            },
            {
              model: Encuesta,
              attributes: [
                "titulo",
                "id_encuesta",
                "post_id",
                "multiple_opciones",
              ],
              include: [
                {
                  model: OpcionEncuesta,
                  attributes: ["texto_opcion"],
                },
              ],
            },
          ],
        },
      ],
    });
    res.json(savedPosts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener los posts guardados", error });
  }
};

export const obtenerGuardadosPost = async (req: Request, res: Response) => {
  const { idPost } = req.params;
  const { userId } = req.query;

  try {
    const post = await Post.findByPk(idPost);
    if (!post) {
      res.status(404).json({ msg: `No existe el post con el id ${idPost}` });
      return;
    }

    // Comprobar si el usuario ha guardado el post
    const usuarioHaGuardado = await Save.findOne({
      where: { post_id: idPost, id_usuario: userId },
    });

    const saved = usuarioHaGuardado !== null;

    res.json({ saved });
  } catch (error) {
    res.status(500).json({
      msg: "Error al contar el número de guardados",
      error,
    });
  }
};

export const comentar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, comentario } = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ msg: `No existe el post con el id ${id}` });
      return;
    }

    // Crear el comentario
    const nuevoComentario = await Comentario.create({
      id_usuario: userId,
      post_id: id,
      contenido: comentario,
    });

    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({
      id: id,
      userId: userId,
      comentario: comentario,
      msg: "ERROR 500: Error al crear el comentarioZ",
      error,
    });
  }
};

export const verComentarios = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ msg: `No existe el post con el id ${id}` });
      return;
    }

    // Obtener los comentarios del post
    const comentarios = await Comentario.findAll({
      where: { post_id: id },
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: [
            "id_usuario",
            "username",
            "email",
            "url_imagen_perfil",
            "nombre_completo",
            "portada",
          ],
        },
      ],
    });

    res.json(comentarios);
  } catch (error) {
    res.status(500).json({
      msg: "ERROR 500: Error al obtener los comentarios",
      error,
    });
  }
};

export const votarEncuesta = async (req: Request, res: Response) => {
  const { id: idEncuesta } = req.params;
  const { userId, seleccion, multiple } = req.body;

  console.log(req.body);
  try {
    const encuesta = await Encuesta.findByPk(idEncuesta);
    if (!encuesta) {
      res
        .status(404)
        .json({ msg: `No existe la encuesta con el id ${idEncuesta}` });
      return;
    }

    if (!multiple) {
      // Eliminar el voto anterior si no es múltiple
      await VotosEncuesta.destroy({
        where: { id_encuesta: idEncuesta, id_usuario: userId },
      });

      // Crear el voto de la encuesta
      const nuevoVoto = await VotosEncuesta.create({
        id_encuesta: idEncuesta,
        id_usuario: userId,
        id_opcion: seleccion,
      });
      res.status(201).json({ msg: "Voto guardado", nuevoVoto });
      return;
    } else {
      // Alternar voto para opciones múltiples
      const votoExistente = await VotosEncuesta.findOne({
        where: {
          id_encuesta: idEncuesta,
          id_usuario: userId,
          id_opcion: seleccion,
        },
      });
      //
      if (votoExistente) {
        await votoExistente.destroy();
        res.json({ msg: "Voto eliminado" });
      } else {
        const nuevoVoto = await VotosEncuesta.create({
          id_encuesta: idEncuesta,
          id_usuario: userId,
          id_opcion: seleccion,
        });
        res.status(201).json({ msg: "Voto guardado", nuevoVoto });
        return;
      }
    }
  } catch (error) {
    res.status(500).json({
      msg: "ERROR 500: Error al guardar el voto de la encuesta",
      error,
    });
    return;
  }
};

export const obtenerEncuestaConVotos = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.query;

  try {
    const encuesta = await Encuesta.findByPk(id, {
      // include: [
      //   {
      //     model: OpcionEncuesta,
      //     attributes: ["id_opcion", "texto_opcion"],
      //     include: [
      //       {
      //         model: VotosEncuesta,
      //         attributes: ["id_usuario"],
      //       },
      //     ],
      //   },
      // ],
    });

    if (!encuesta) {
      res.status(404).json({ msg: `No existe la encuesta con el id ${id}` });
      return;
    }

    const votos = await VotosEncuesta.findAll({
      where: { id_encuesta: id, id_usuario: userId },
      attributes: ["id_opcion"],
    });

    const votosUsuario = votos.map((voto: any) => voto.id_opcion);

    res.json({
      encuesta,
      votos_usuario: votosUsuario,
    });
  } catch (error) {
    res.status(500).json({
      msg: "ERROR 500: Error al obtener la encuesta con votos",
      error,
    });
  }
};

export const obtenerTendencias = async (req: Request, res: Response) => {
  try {
    const tendencias = await Hashtag.findAll({
      attributes: [
        "id_hashtag",
        "hashtag",
        [
          Sequelize.fn("COUNT", Sequelize.col("hashtagPosts.post_id")),
          "cantidad_posts",
        ],
      ],
      include: [
        {
          model: HashtagPost,
          as: "hashtagPosts",
          attributes: [],
        },
      ],
      group: ["id_hashtag", "hashtag"],
      order: [[Sequelize.literal("cantidad_posts"), "DESC"]],
    });

    res.json(tendencias);
  } catch (error) {
    res.status(500).json({
      msg: "ERROR 500: Error al obtener las tendencias",
      error,
    });
  }
};
