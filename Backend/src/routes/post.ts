import { Router } from "express";

import {
  deletePost,
  getPost,
  getPosts,
  crearPost,
  actualizarPost,
  toggleLike,
  obtenerNumeroLikes,
  obtenerNumeroComentarios,
  obtenerNumeroReposts,
  toggleGuardarPost,
  savedPost,
  obtenerGuardadosPost,
  comentar,
  verComentarios,
  votarEncuesta,
  obtenerEncuestaConVotos,
  obtenerTendencias,
} from "../controllers/posts";

const router = Router();

// CRUD POST
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", crearPost);
router.put("/:id", actualizarPost);
router.delete("/:id", deletePost);

// INTERACCIONES POST
router.post("/:id/like", toggleLike);
router.get("/:idPost/likes", obtenerNumeroLikes);
router.get("/:id/numberComments", obtenerNumeroComentarios);
router.get("/:id/reposts", obtenerNumeroReposts);
router.post("/:id/guardar", toggleGuardarPost);
router.get("/saved/:userId", savedPost);
router.get("/:idPost/guardados", obtenerGuardadosPost);
router.post("/:id/encuesta/votar", votarEncuesta);

router.get("/:id/comments", verComentarios);
router.post("/:id/comment", comentar);

router.get("/encuestas/:id", obtenerEncuestaConVotos);

router.get("/tendencias/actual", obtenerTendencias);

export default router;
