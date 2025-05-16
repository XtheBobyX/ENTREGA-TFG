import { Router } from "express";
import { deleteUsuario, getUsuario, getUsuarios, crearUsuario, actualizarUsuario, loginUser,logoutUser, buscadorUsuario, getUsuarioByID} from "../controllers/usuarios";


const router = Router();

router.get('/search',buscadorUsuario)


router.get('/', getUsuarios);
router.get('/:username', getUsuario);

router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', deleteUsuario);

router.post('/login',loginUser);
router.post('/logout',logoutUser);

router.get('/id/:id',getUsuarioByID);


export default router;