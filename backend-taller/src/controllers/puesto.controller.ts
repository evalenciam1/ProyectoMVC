import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// Obtener todos los puestos
export const obtenerPuestos = async (_req: Request, res: Response) => {
  try {
    const puestos = await prisma.puesto.findMany({
      include: {
        empleados: true,
      },
    });
    res.json(puestos);
  } catch (error) {
    console.error('Error al obtener puestos:', error);
    res.status(500).json({ mensaje: 'Error al obtener puestos', error });
  }
};

// Obtener un puesto por ID
export const obtenerPuestoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const puesto = await prisma.puesto.findUnique({
      where: { id },
      include: {
        empleados: true,
      },
    });
    if (!puesto) return res.status(404).json({ mensaje: 'Puesto no encontrado' });
    res.json(puesto);
  } catch (error) {
    console.error('Error al obtener puesto:', error);
    res.status(500).json({ mensaje: 'Error al obtener puesto', error });
  }
};

// Crear un nuevo puesto
export const crearPuesto = async (req: Request, res: Response) => {
  const { nombre, departamento, descripcion } = req.body;

  try {
    const nuevoPuesto = await prisma.puesto.create({
      data: {
        nombre,
        departamento,
        descripcion,
      },
    });
    res.status(201).json(nuevoPuesto);
  } catch (error) {
    console.error('Error al crear puesto:', error);
    res.status(500).json({ mensaje: 'Error al crear puesto', error });
  }
};

// Actualizar un puesto
export const actualizarPuesto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nombre, departamento, descripcion } = req.body;

  try {
    const puestoActualizado = await prisma.puesto.update({
      where: { id },
      data: {
        nombre,
        departamento,
        descripcion,
      },
    });
    res.json(puestoActualizado);
  } catch (error) {
    console.error('Error al actualizar puesto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar puesto', error });
  }
};

// Eliminar un puesto
export const eliminarPuesto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.puesto.delete({
      where: { id },
    });
    res.json({ mensaje: 'Puesto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar puesto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar puesto', error });
  }
};
