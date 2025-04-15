import { Router } from "express";
import {crearUsuario, obtenerUsuarios, obtenerUsPorId, eliminarUsuario, actualizarUsuario} from "../controllers/usuario.controller";
//import * as usuarioController from "../controllers/usuario.controller";

console.log(typeof obtenerUsPorId); // debe ser 'function'

const router = Router();


router.post('/', crearUsuario);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsPorId);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);


export default router;