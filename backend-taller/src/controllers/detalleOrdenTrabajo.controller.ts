import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const crearDetalleOrden = async (req: Request, res: Response) => {
  const { descripcion, cantidad, precioUnitario, ordenTrabajoId } = req.body;

  try {
    const detalle = await prisma.detalleOrdenTrabajo.create({
      data: {
        descripcion,
        cantidad: Number(cantidad),
        precioUnitario: Number(precioUnitario),
        ordenTrabajoId: Number(ordenTrabajoId),
      },
    });
    return res.status(201).json(detalle);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear detalle', error });
  }
};

export const obtenerDetallesOrden = async (_req: Request, res: Response) => {
  try {
    const detalles = await prisma.detalleOrdenTrabajo.findMany({
      include: {
        ordenTrabajo: true,
      },
    });
    return res.json(detalles);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener detalles', error });
  }
};

export const obtenerDetallePorId = async (req: Request, res: Response) => {
  const id  = Number(req.params.id);

  try {
    const detalle = await prisma.detalleOrdenTrabajo.findMany({
      where: { id  },
      include: { ordenTrabajo: true },
    });
    if (!detalle) return res.status(404).json({ mensaje: 'Detalle no encontrado' });
    return res.json(detalle);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener detalle', error });
  }
};

export const obtenerDetallesPorOrdenTrabajo = async (req: Request, res: Response) => {
  const ordenTrabajoId = Number(req.params.ordenTrabajoId);

  try {
    const detalles = await prisma.detalleOrdenTrabajo.findMany({
      where: { ordenTrabajoId },
      include: { ordenTrabajo: true },
    });

    return res.json(detalles);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener detalles', error });
  }
};

export const actualizarDetalleOrden = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { descripcion, cantidad, precioUnitario } = req.body;

  try {
    const detalle = await prisma.detalleOrdenTrabajo.update({
      where: { id },
      data: {
        descripcion,
        cantidad: Number(cantidad),
        precioUnitario: Number(precioUnitario),

      },
    });
    return res.json(detalle);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar detalle', error });
  }
};

export const eliminarDetalleOrden = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.detalleOrdenTrabajo.delete({ where: { id } });
    return res.json({ mensaje: 'Detalle eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar detalle', error });
  }
};
