import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuarioRouter from "./routes/usuario.routes";
import clienteRouter from "./routes/cliente.routes";
import vehiculoRouter from "./routes/vehiculo.routes";
import ordenTrabajoRouter from "./routes/ordenTrabajo.routes";
import detalleOrdenTrabajoRouter from "./routes/detalleOrdenTrabajo.routes";
import empleadoRouter from "./routes/empleado.routes";
import puestoRouter from "./routes/puesto.routes";

dotenv.config();

const app = Express();

app.use(cors());
app.use(Express.json());

app.get("/", (_req, res) => {
  res.send("API Taller Automotriz funcionando");
});

app.use("/api/usuarios", usuarioRouter);
app.use("/api/clientes", clienteRouter);
app.use("/api/vehiculos", vehiculoRouter);
app.use("/api/ordenes-trabajo", ordenTrabajoRouter);
app.use("/api/detalles-orden", detalleOrdenTrabajoRouter);
app.use("/api/empleados", empleadoRouter);
app.use("/api/puestos", puestoRouter);

export default app;