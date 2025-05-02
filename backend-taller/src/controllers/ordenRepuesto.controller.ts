import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const obtenerRepuestos = async (_req: Request, res: Response) => {
  try {
    const repuestos = await prisma.ordenRepuesto.findMany({
      include: {
        orden: true,
      },
    });
    res.json(repuestos);
  } catch (error) {
    console.error('Error al obtener repuestos:', error);
    res.status(500).json({ mensaje: 'Error al obtener repuestos', error });
  }
};

export const obtenerRepuestosPorOrden = async (req: Request, res: Response) => {
  const ordenId = Number(req.params.ordenId);
  try {
    const repuestos = await prisma.ordenRepuesto.findMany({
      where: { ordenId },
      include: {
        orden: true,
      },
    });
    res.json(repuestos);
  } catch (error) {
    console.error('Error al obtener repuestos por orden:', error);
    res.status(500).json({ mensaje: 'Error al obtener repuestos por orden', error });
  }
};

export const obtenerRepuestoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const repuesto = await prisma.ordenRepuesto.findUnique({
      where: { id },
      include: {
        orden: true,
      },
    });
    if (!repuesto) return res.status(404).json({ mensaje: 'Repuesto no encontrado' });
    res.json(repuesto);
  } catch (error) {
    console.error('Error al obtener repuesto:', error);
    res.status(500).json({ mensaje: 'Error al obtener repuesto', error });
  }
};

export const crearRepuesto = async (req: Request, res: Response) => {
  const { ordenId, descripcion, cantidad, precioUnitario, costoUnitario } = req.body;

  try {
    const nuevoRepuesto = await prisma.ordenRepuesto.create({
      data: {
        ordenId: Number(ordenId),
        descripcion,
        cantidad: Number(cantidad),
        precioUnitario,
        costoUnitario,
      },
    });
    res.status(201).json(nuevoRepuesto);
  } catch (error) {
    console.error('Error al crear repuesto:', error);
    res.status(500).json({ mensaje: 'Error al crear repuesto', error });
  }
};

export const actualizarRepuesto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { ordenId, descripcion, cantidad, precioUnitario, costoUnitario } = req.body;

  try {
    const repuestoActualizado = await prisma.ordenRepuesto.update({
      where: { id },
      data: {
        ordenId: Number(ordenId),
        descripcion,
        cantidad: Number(cantidad),
        precioUnitario,
        costoUnitario,
      },
    });
    res.json(repuestoActualizado);
  } catch (error) {
    console.error('Error al actualizar repuesto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar repuesto', error });
  }
};

export const eliminarRepuesto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.ordenRepuesto.delete({
      where: { id },
    });
    res.json({ mensaje: 'Repuesto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar repuesto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar repuesto', error });
  }
};
