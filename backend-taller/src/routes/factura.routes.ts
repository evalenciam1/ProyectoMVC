import { Router } from 'express';
import {
  crearFactura,
  obtenerFacturas,
  obtenerFacturaPorId,
  actualizarFactura,
  eliminarFactura,
  generarFacturaDesdeOrden
} from '../controllers/factura.controller';

const router = Router();

router.post('/', crearFactura);
router.get('/', obtenerFacturas);
router.get('/:id', obtenerFacturaPorId);
router.put('/:id', actualizarFactura);
router.delete('/:id', eliminarFactura);
router.post('/generar-desde-orden/:ordenId', generarFacturaDesdeOrden);

export default router;
