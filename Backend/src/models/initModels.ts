import Usuario from "./usuarioM";
import Post from "./postM";
import { Multimedia } from "./ImagenM";
import { Encuesta } from "./encuestas/encuestaM";
import { OpcionEncuesta } from "./encuestas/opcionesEncuestaM";
import { VotosEncuesta } from "./encuestas/votosEncuestaM";
import { Like } from "./likeM";
import { Follow } from "./followM";
import { Save } from "./guardarPostM";
import { Comentario } from "./comentarioM";
import { Hashtag } from "./hashtagsM";
import { HashtagPost } from "./hashtagsPostM";
import { Mensaje } from "./mensajeM";

//
// 📌 Usuario - Post
//
Usuario.hasMany(Post, { foreignKey: "id_usuario" });
Post.belongsTo(Usuario, { foreignKey: "id_usuario" });

//
// 📌 Post - Multimedia
//
Post.hasMany(Multimedia, { foreignKey: "post_id" });
Multimedia.belongsTo(Post, { foreignKey: "post_id" });

//
// 📌 Post - Encuesta
//
Post.hasMany(Encuesta, { foreignKey: "post_id" });
Encuesta.belongsTo(Post, { foreignKey: "post_id" });

//
// 📌 Encuesta - OpcionEncuesta
//
Encuesta.hasMany(OpcionEncuesta, { foreignKey: "id_encuesta" });
OpcionEncuesta.belongsTo(Encuesta, { foreignKey: "id_encuesta" });

//
// 📌 Usuario - Post (Likes) (Muchos a muchos con alias)
//
Usuario.belongsToMany(Post, {
  through: Like,
  foreignKey: "id_usuario",
  otherKey: "post_id",
  as: "posts_likeados",
});

Post.belongsToMany(Usuario, {
  through: Like,
  foreignKey: "post_id",
  otherKey: "id_usuario",
  as: "usuarios_que_dieron_like",
});

//
// 📌 Usuario - Follow
//
Follow.belongsTo(Usuario, {
  foreignKey: "id_seguido",
  as: "usuarioSeguido",
});
Usuario.hasMany(Follow, {
  foreignKey: "id_seguido",
  as: "seguidores",
});

//
// 📌 Usuario - Save - Post
//
Save.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuarioGuardado",
});
Save.belongsTo(Post, {
  foreignKey: "post_id",
  as: "post",
});
Post.hasMany(Save, {
  foreignKey: "post_id",
  as: "guardados",
});

//
// 📌 Comentarios
//
Post.hasMany(Comentario, {
  foreignKey: "post_id",
  as: "comentarios",
});
Comentario.belongsTo(Post, {
  foreignKey: "post_id",
  as: "post",
});
Usuario.hasMany(Comentario, {
  foreignKey: "id_usuario",
  as: "comentarios",
});
Comentario.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

//
// 📌 Hashtag - Post (muchos a muchos con tabla intermedia HashtagPost)
//
Hashtag.belongsToMany(Post, {
  through: HashtagPost,
  foreignKey: "id_hashtag",
  otherKey: "post_id",
  as: "posts",
});
Post.belongsToMany(Hashtag, {
  through: HashtagPost,
  foreignKey: "post_id",
  otherKey: "id_hashtag",
  as: "hashtags",
});

// Relaciones adicionales con HashtagPost directamente
Hashtag.hasMany(HashtagPost, {
  foreignKey: "id_hashtag",
  as: "hashtagPosts",
});
Post.hasMany(HashtagPost, {
  foreignKey: "post_id",
  as: "hashtagPosts",
});
HashtagPost.belongsTo(Post, {
  foreignKey: "post_id",
  as: "post",
});
HashtagPost.belongsTo(Hashtag, {
  foreignKey: "id_hashtag",
  as: "hashtag",
});
// Relaciones
Mensaje.belongsTo(Usuario, {
  as: "remitente",
  foreignKey: "id_remitente"
});

Mensaje.belongsTo(Usuario, {
  as: "receptor",
  foreignKey: "id_receptor"
});

Usuario.hasMany(Mensaje, { foreignKey: "id_remitente", as: "mensajesEnviados" });
Usuario.hasMany(Mensaje, { foreignKey: "id_receptor", as: "mensajesRecibidos" });

export {
  Usuario,
  Post,
  Multimedia,
  Encuesta,
  OpcionEncuesta,
  VotosEncuesta,
  Like,
  Follow,
  Save,
  Comentario,
  Hashtag,
  HashtagPost,
  Mensaje
};
