import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// Crear detalle
export const crearDetalleOrden = async (req: Request, res: Response) => {
  const { descripcion, cantidad, precioUnitario, costoUnitario, ordenTrabajoId, empleadoId } = req.body;

  if (!descripcion || !cantidad || !precioUnitario || !costoUnitario || !ordenTrabajoId) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  try {
    const detalle = await prisma.detalleOrdenTrabajo.create({
      data: {
        descripcion,
        cantidad: Number(cantidad),
        precioUnitario: parseFloat(precioUnitario),
        costoUnitario: parseFloat(costoUnitario),
        ordenTrabajoId: Number(ordenTrabajoId),
        empleadoId: empleadoId ? Number(empleadoId) : null,
      },
    });
    return res.status(201).json(detalle);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear detalle', error });
  }
};

// Obtener todos los detalles
export const obtenerDetallesOrden = async (_req: Request, res: Response) => {
  try {
    const detalles = await prisma.detalleOrdenTrabajo.findMany({
      include: {
        ordenTrabajo: true,
        empleado: true,
      },
    });
    return res.json(detalles);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener detalles', error });
  }
};

// Obtener detalle por ID
export const obtenerDetallePorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    const detalle = await prisma.detalleOrdenTrabajo.findUnique({
      where: { id },
      include: {
        ordenTrabajo: true,
        empleado: true,
      },
    });

    if (!detalle) return res.status(404).json({ mensaje: 'Detalle no encontrado' });
    return res.json(detalle);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener detalle', error });
  }
};

// Obtener detalles por orden de trabajo
export const obtenerDetallesPorOrdenTrabajo = async (req: Request, res: Response) => {
  const ordenTrabajoId = Number(req.params.ordenTrabajoId);
  if (isNaN(ordenTrabajoId)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    const detalles = await prisma.detalleOrdenTrabajo.findMany({
      where: { ordenTrabajoId },
      include: {
        ordenTrabajo: true,
        empleado: true,
      },
    });

    return res.json(detalles);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener detalles', error });
  }
};

// Actualizar detalle
export const actualizarDetalleOrden = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { descripcion, cantidad, precioUnitario, costoUnitario, empleadoId } = req.body;

  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    const detalle = await prisma.detalleOrdenTrabajo.update({
      where: { id },
      data: {
        descripcion,
        cantidad: Number(cantidad),
        precioUnitario: parseFloat(precioUnitario),
        costoUnitario: parseFloat(costoUnitario),
        empleadoId: empleadoId ? Number(empleadoId) : null,
      },
    });
    return res.json(detalle);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar detalle', error });
  }
};

// Eliminar detalle
export const eliminarDetalleOrden = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    await prisma.detalleOrdenTrabajo.delete({ where: { id } });
    return res.json({ mensaje: 'Detalle eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar detalle', error });
  }
};