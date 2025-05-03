import  Express  from "express";
import cors from 'cors';
import dotenv from "dotenv";
import usuarioRouter from "./routes/usuario.routes";
import clienteRouter from "./routes/cliente.routes"; // ✅ Importar correctamente
import vehiculoRouter from "./routes/vehiculo.routes"; // ✅ Importar correctamente
import ordenTrabajoRouter from './routes/ordenTrabajo.routes'; // ✅ Importar correctamente
import detalleOrdenTrabajoRouter from './routes/detalleOrdenTrabajo.routes';
import OrdenRepuesto  from './routes/ordenRepuesto.routes';
import puestoRouter from './routes/puesto.routes';
import empleadoRoutes from './routes/empleado.routes';
import facturaRouter from './routes/factura.routes'; // ✅ Importar correctamente
import detalleFacturaRouter from './routes/detallefactura.routes'; // ✅ Importar correctamente

dotenv.config();

const app = Express();
app.use(cors());
app.use(Express.json());

app.get("/", (req, res) => {
  res.send("API Taller Automotriz funcionando");
});

// Importar las rutas de los controladores

app.use('/api/usuarios', usuarioRouter);
app.use('/api/clientes', clienteRouter);
app.use('/api/vehiculos', vehiculoRouter);
app.use('/api/ordenes-trabajo', ordenTrabajoRouter);
app.use('/api/detalles-orden', detalleOrdenTrabajoRouter);
app.use('/api/repuestos', OrdenRepuesto);
app.use('/api/puestos', puestoRouter);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/facturas', facturaRouter);
app.use('/api/detalle-factura', detalleFacturaRouter);

export default app;