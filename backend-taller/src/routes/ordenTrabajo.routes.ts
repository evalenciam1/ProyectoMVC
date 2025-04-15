import { Router } from 'express';
import {
  crearOrdenTrabajo,
  obtenerOrdenesTrabajo,
  obtenerOrdenTrabajoPorId,
  actualizarOrdenTrabajo,
  eliminarOrdenTrabajo,
} from '../controllers/ordenTrabajo.controller';

const router = Router();

router.post('/', crearOrdenTrabajo);
router.get('/', obtenerOrdenesTrabajo);
router.get('/:id', obtenerOrdenTrabajoPorId);
router.put('/:id', actualizarOrdenTrabajo);
router.delete('/:id', eliminarOrdenTrabajo);

export default router;
