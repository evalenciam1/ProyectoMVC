import { Router } from 'express';
import {
  obtenerRepuestos,
  obtenerRepuestoPorId,
  obtenerRepuestosPorOrden,
  crearRepuesto,
  actualizarRepuesto,
  eliminarRepuesto,
} from '../controllers/ordenRepuesto.controller';

const router = Router();

// Obtener todos los repuestos
router.get('/', obtenerRepuestos);

// Obtener repuestos por ID de orden
router.get('/orden/:ordenId', obtenerRepuestosPorOrden);

// Obtener repuesto por ID único
router.get('/:id', obtenerRepuestoPorId);

// Crear nuevo repuesto
router.post('/', crearRepuesto);

// Actualizar repuesto
router.put('/:id', actualizarRepuesto);

// Eliminar repuesto
router.delete('/:id', eliminarRepuesto);

export default router;

