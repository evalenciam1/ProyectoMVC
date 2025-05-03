import { Router } from 'express';
import {
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from '../controllers/empleado.controller';

const router = Router();

router.get('/', obtenerEmpleados);
router.get('/:id', obtenerEmpleadoPorId);
router.post('/', crearEmpleado);
router.put('/:id', actualizarEmpleado);
router.delete('/:id', eliminarEmpleado);

export default router;