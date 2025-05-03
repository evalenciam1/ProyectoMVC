import { Router } from 'express';
import {
  crearDetalleFactura,
  obtenerDetallesFactura,
  obtenerDetalleFacturaPorId,
  actualizarDetalleFactura,
  eliminarDetalleFactura,
  obtenerDetallesPorFacturaId
} from '../controllers/detallefactura.controller';

const router = Router();

router.post('/', crearDetalleFactura);                        // Crear detalle
router.get('/', obtenerDetallesFactura);                     // Obtener todos
router.get('/:id', obtenerDetalleFacturaPorId);              // Obtener por ID
router.put('/:id', actualizarDetalleFactura);                // Actualizar por ID
router.delete('/:id', eliminarDetalleFactura);               // Eliminar por ID
router.get('/factura/:facturaId', obtenerDetallesPorFacturaId);
export default router;
