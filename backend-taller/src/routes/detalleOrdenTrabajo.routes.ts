import { Router } from 'express';
import {
  crearDetalleOrden,
  obtenerDetallesOrden,
  obtenerDetallePorId,
  actualizarDetalleOrden,
  eliminarDetalleOrden,
  obtenerDetallesPorOrdenTrabajo,
} from '../controllers/detalleOrdenTrabajo.controller';

const router = Router();

router.post('/', crearDetalleOrden);
router.get('/', obtenerDetallesOrden);
router.get('/:id', obtenerDetallePorId);
router.get('/orden/:ordenTrabajoId', obtenerDetallesPorOrdenTrabajo);
router.put('/:id', actualizarDetalleOrden);
router.delete('/:id', eliminarDetalleOrden);


export default router;
