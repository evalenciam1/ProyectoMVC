import { Router } from 'express';
import {
  obtenerDetalles,
  obtenerDetallePorId,
  obtenerDetallesPorOrden,
  crearDetalle,
  actualizarDetalle,
  eliminarDetalle,
} from '../controllers/detalleOrdenTrabajo.controller';

const router = Router();

// Obtener todos los detalles
router.get('/', obtenerDetalles);

// Obtener detalles por ID de orden de trabajo
router.get('/orden/:ordenTrabajoId', obtenerDetallesPorOrden);

// Obtener detalle por ID único
router.get('/:id', obtenerDetallePorId);

// Crear nuevo detalle
router.post('/', crearDetalle);

// Actualizar detalle
router.put('/:id', actualizarDetalle);

// Eliminar detalle
router.delete('/:id', eliminarDetalle);

export default router;