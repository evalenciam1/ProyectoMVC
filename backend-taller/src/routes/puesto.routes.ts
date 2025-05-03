import { Router } from "express";
import {
  crearPuesto,
  obtenerPuestos,
  obtenerPuestoPorId,
  actualizarPuesto,
  eliminarPuesto
} from "../controllers/puesto.controller";

const router = Router();

router.post('/', crearPuesto);
router.get('/', obtenerPuestos);
router.get('/:id', obtenerPuestoPorId);
router.put('/:id', actualizarPuesto);
router.delete('/:id', eliminarPuesto);

export default router;
