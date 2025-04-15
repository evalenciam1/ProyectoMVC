import { Router } from 'express';
import { actualizarVehiculo, crearVehiculo, eliminarVehiculo, obtenerVehiculos } from '../controllers/vehiculo.controller';
import { obtenerVehiculoPorId } from '../controllers/vehiculo.controller'; // Asegúrate de que esta función esté exportada correctamente

const router = Router();

router.post('/', crearVehiculo);
router.get('/', obtenerVehiculos);
router.get('/:id', obtenerVehiculoPorId);
router.put('/:id', actualizarVehiculo);
router.delete('/:id', eliminarVehiculo);

export default router;
