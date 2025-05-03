import { Router } from 'express';
import {
  crearFactura,
  obtenerFacturas,
  obtenerFacturaPorId,
  actualizarFactura,
  eliminarFactura
} from '../controllers/factura.controller';

const router = Router();

router.post('/', crearFactura);                       // Crear factura
router.get('/', obtenerFacturas);                    // Obtener todas
router.get('/:id', obtenerFacturaPorId);             // Obtener por ID
router.put('/:id', actualizarFactura);               // Actualizar por ID
router.delete('/:id', eliminarFactura);              // Eliminar por ID

export default router;
