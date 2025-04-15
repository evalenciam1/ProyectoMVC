import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const crearVehiculo = async (req: Request, res: Response) => {
  try {
    const vehiculo = await prisma.vehiculo.create({
      data: req.body,
    });
    res.status(201).json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear vehículo', details: error });
  }
};

export const obtenerVehiculos = async (req: Request, res: Response) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      include: { cliente: true },
    });
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener vehículos' });
  }
};

export const obtenerVehiculoPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const vehiculo = await prisma.vehiculo.findUnique({
        where: { id: Number(id) }
      });
  
      if (!vehiculo) {
        return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
      }
  
      res.json(vehiculo);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el vehículo' });
    }
  };

// ✅ Eliminar vehículo por ID
export const eliminarVehiculo = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const vehiculoEliminado = await prisma.vehiculo.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      mensaje: 'Vehículo eliminado correctamente',
      vehiculo: vehiculoEliminado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar el vehículo',
      error,
    });
  }
};

// ✅ Actualizar vehículo por ID
export const actualizarVehiculo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  try {
    const vehiculoActualizado = await prisma.vehiculo.update({
      where: { id: Number(id) },
      data: datosActualizados,
    });

    res.status(200).json({
      mensaje: 'Vehículo actualizado correctamente',
      vehiculo: vehiculoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar el vehículo',
      error,
    });
  }
};

