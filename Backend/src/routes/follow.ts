import { Router } from "express";

import {
  getFollowStatus,
  getSeguido,
  getSeguidores,
  toggleFollow,
  topSeguidores,
} from "../controllers/follower";

const router = Router();

// CRUD POST
router.post("/:id", toggleFollow);
router.get("/follow-status/:idSeguidor/:idSeguido", getFollowStatus);
//
router.get("/numSeguidores/:id", getSeguidores);
router.get("/numSeguidos/:id", getSeguido);
//
router.get('/topSeguidores',topSeguidores);

export default router;
