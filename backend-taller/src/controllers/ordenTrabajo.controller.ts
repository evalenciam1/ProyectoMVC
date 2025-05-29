import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// Obtener todas las órdenes de trabajo
export const obtenerOrdenesTrabajo = async (_req: Request, res: Response) => {
  try {
    const ordenes = await prisma.ordenTrabajo.findMany({
      include: {
        vehiculo: {
          include: {
            cliente: true, // Para saber a quién pertenece el vehículo
          },
        },
        factura: true,
        detalles: true,
        repuestos: true,
      },
    });

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener órdenes', error });
  }
};

// Obtener una orden por ID
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
        factura: true,
        detalles: true,
        repuestos: true,
      },
    });

    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la orden', error });
  }
};

// Crear orden de trabajo (❌ sin clienteId)
export const crearOrdenTrabajo = async (req: Request, res: Response) => {
  const { vehiculoId, estado, descripcion } = req.body;

  try {
    const nuevaOrden = await prisma.ordenTrabajo.create({
      data: {
        vehiculoId: Number(vehiculoId),
        estado,
        descripcion,
      },
    });

    res.status(201).json(nuevaOrden);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear orden de trabajo', error });
  }
};

// Actualizar orden de trabajo (❌ sin clienteId)
export const actualizarOrdenTrabajo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { vehiculoId, estado, descripcion } = req.body;

  try {
    const ordenActualizada = await prisma.ordenTrabajo.update({
      where: { id },
      data: {
        vehiculoId: Number(vehiculoId),
        estado,
        descripcion,
      },
    });

    res.json(ordenActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la orden', error });
  }
};

// Eliminar orden
export const eliminarOrdenTrabajo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.ordenTrabajo.delete({ where: { id } });
    res.json({ mensaje: 'Orden eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la orden', error });
  }
};
