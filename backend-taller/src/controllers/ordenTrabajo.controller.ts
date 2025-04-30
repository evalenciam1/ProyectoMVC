import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// Crear una orden de trabajo
export const crearOrdenTrabajo = async (req: Request, res: Response) => {
  const { descripcion, estado, fechaSalida, vehiculoId } = req.body;

  if (!descripcion || !estado || !vehiculoId) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  try {
    const orden = await prisma.ordenTrabajo.create({
      data: {
        descripcion,
        estado,
        vehiculoId: Number(vehiculoId),
        fechaSalida: fechaSalida ? new Date(fechaSalida) : undefined,
      },
    });

    return res.status(201).json(orden);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear la orden de trabajo', error });
  }
};

// Obtener todas las órdenes de trabajo
export const obtenerOrdenesTrabajo = async (_req: Request, res: Response) => {
  try {
    const ordenes = await prisma.ordenTrabajo.findMany({
      include: {
        vehiculo: {
          include: {
            cliente: true,
          },
        },
        detalles: true,
        repuestos: true,
        factura: true,
        detalleFacturas: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return res.json(ordenes);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener las órdenes', error });
  }
};

// Obtener una orden de trabajo por ID
export const obtenerOrdenTrabajoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    const orden = await prisma.ordenTrabajo.findUnique({
      where: { id },
      include: {
        vehiculo: {
          include: {
            cliente: true,
          },
        },
        detalles: true,
        repuestos: true,
        factura: true,
        detalleFacturas: true,
      },
    });

    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    return res.json(orden);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener la orden', error });
  }
};

// Actualizar una orden de trabajo
export const actualizarOrdenTrabajo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { descripcion, estado, fechaSalida, vehiculoId } = req.body;

  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    const orden = await prisma.ordenTrabajo.update({
      where: { id },
      data: {
        descripcion,
        estado,
        fechaSalida: fechaSalida ? new Date(fechaSalida) : undefined,
        vehiculoId: vehiculoId ? Number(vehiculoId) : undefined,
      },
    });

    return res.json({ mensaje: 'Orden actualizada correctamente', orden });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar la orden', error });
  }
};

// Eliminar una orden de trabajo
export const eliminarOrdenTrabajo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    await prisma.ordenTrabajo.delete({
      where: { id },
    });

    return res.json({ mensaje: 'Orden eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar la orden', error });
  }
};