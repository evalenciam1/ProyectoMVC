import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const crearOrdenTrabajo = async (req: Request, res: Response) => {
  const { descripcion, estado, clienteId, vehiculoId } = req.body;

  try {
    const orden = await prisma.ordenTrabajo.create({
      data: {
        descripcion,
        estado,
        clienteId: Number(clienteId),
        vehiculoId: Number(vehiculoId),
      },
    });

    return res.status(201).json(orden);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear orden de trabajo', error });
  }
};

export const obtenerOrdenesTrabajo = async (_req: Request, res: Response) => {
  try {
    const ordenes = await prisma.ordenTrabajo.findMany({
      include: {
        cliente: true,
        vehiculo: true,
      },
    });
    return res.json(ordenes);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener órdenes', error });
  }
};

export const obtenerOrdenTrabajoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    const orden = await prisma.ordenTrabajo.findUnique({
      where: { id },
      include: {
        cliente: true,
        vehiculo: true,
      },
    });
    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    return res.json(orden);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener orden', error });
  }
};

export const actualizarOrdenTrabajo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { descripcion, estado } = req.body;
  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    const orden = await prisma.ordenTrabajo.update({
      where: { id },
      data: { descripcion, estado },
    });
    return res.json(orden);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar orden', error });
  }
};

export const eliminarOrdenTrabajo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    await prisma.ordenTrabajo.delete({ where: { id } });
    return res.json({ mensaje: 'Orden eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar orden', error });
  }
};
