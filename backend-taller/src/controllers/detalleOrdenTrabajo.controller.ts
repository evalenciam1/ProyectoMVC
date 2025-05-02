import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const obtenerDetalles = async (_req: Request, res: Response) => {
  try {
    const detalles = await prisma.detalleOrdenTrabajo.findMany({
      include: {
        ordenTrabajo: true,
        empleado: true,
      },
    });
    res.json(detalles);
  } catch (error) {
    console.error('Error al obtener detalles:', error);
    res.status(500).json({ mensaje: 'Error al obtener detalles', error });
  }
};

export const obtenerDetallesPorOrden = async (req: Request, res: Response) => {
  const ordenTrabajoId = Number(req.params.ordenTrabajoId);
  try {
    const detalles = await prisma.detalleOrdenTrabajo.findMany({
      where: { ordenTrabajoId },
      include: {
        ordenTrabajo: true,
        empleado: true,
      },
    });
    res.json(detalles);
  } catch (error) {
    console.error('Error al obtener detalles de la orden:', error);
    res.status(500).json({ mensaje: 'Error al obtener detalles de la orden', error });
  }
};

export const obtenerDetallePorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const detalle = await prisma.detalleOrdenTrabajo.findUnique({
      where: { id },
      include: {
        ordenTrabajo: true,
        empleado: true,
      },
    });
    if (!detalle) return res.status(404).json({ mensaje: 'Detalle no encontrado' });
    res.json(detalle);
  } catch (error) {
    console.error('Error al obtener detalle:', error);
    res.status(500).json({ mensaje: 'Error al obtener detalle', error });
  }
};

export const crearDetalle = async (req: Request, res: Response) => {
  const { ordenTrabajoId, empleadoId, descripcion, cantidad, precioUnitario, costoUnitario } = req.body;

  try {
    const nuevoDetalle = await prisma.detalleOrdenTrabajo.create({
      data: {
        ordenTrabajoId: Number(ordenTrabajoId),
        empleadoId: empleadoId ? Number(empleadoId) : null,
        descripcion,
        cantidad: Number(cantidad),
        precioUnitario,
        costoUnitario,
      },
    });
    res.status(201).json(nuevoDetalle);
  } catch (error) {
    console.error('Error al crear detalle:', error);
    res.status(500).json({ mensaje: 'Error al crear detalle', error });
  }
};

export const actualizarDetalle = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { ordenTrabajoId, empleadoId, descripcion, cantidad, precioUnitario, costoUnitario } = req.body;

  try {
    const detalleActualizado = await prisma.detalleOrdenTrabajo.update({
      where: { id },
      data: {
        ordenTrabajoId: Number(ordenTrabajoId),
        empleadoId: empleadoId ? Number(empleadoId) : null,
        descripcion,
        cantidad: Number(cantidad),
        precioUnitario,
        costoUnitario,
      },
    });
    res.json(detalleActualizado);
  } catch (error) {
    console.error('Error al actualizar detalle:', error);
    res.status(500).json({ mensaje: 'Error al actualizar detalle', error });
  }
};

export const eliminarDetalle = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.detalleOrdenTrabajo.delete({
      where: { id },
    });
    res.json({ mensaje: 'Detalle eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar detalle:', error);
    res.status(500).json({ mensaje: 'Error al eliminar detalle', error });
  }
};
