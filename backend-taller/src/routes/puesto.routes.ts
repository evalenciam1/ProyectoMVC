import { Router } from 'express';
import {
  obtenerPuestos,
  obtenerPuestoPorId,
  crearPuesto,
  actualizarPuesto,
  eliminarPuesto,
} from '../controllers/puesto.controller';

const router = Router();

// Obtener todos los puestos
router.get('/', obtenerPuestos);

// Obtener un puesto por ID
router.get('/:id', obtenerPuestoPorId);

// Crear nuevo puesto
router.post('/', crearPuesto);

// Actualizar un puesto existente
router.put('/:id', actualizarPuesto);

// Eliminar un puesto
router.delete('/:id', eliminarPuesto);

export default router;
