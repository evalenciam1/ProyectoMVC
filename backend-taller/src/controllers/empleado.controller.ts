import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// Obtener todos los empleados
export const obtenerEmpleados = async (_req: Request, res: Response) => {
  try {
    const empleados = await prisma.empleado.findMany({
      include: {
        puesto: true,
        servicios: true,
      },
    });
    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ mensaje: 'Error al obtener empleados', error });
  }
};

// Obtener un empleado por ID
export const obtenerEmpleadoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const empleado = await prisma.empleado.findUnique({
      where: { id },
      include: {
        puesto: true,
        servicios: true,
      },
    });
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ mensaje: 'Error al obtener empleado', error });
  }
};

// Crear un nuevo empleado
export const crearEmpleado = async (req: Request, res: Response) => {
  const { nombre, telefono, cargo, salario, puestoId } = req.body;

  try {
    const nuevoEmpleado = await prisma.empleado.create({
      data: {
        nombre,
        telefono,
        cargo,
        salario,
        puestoId: Number(puestoId),
      },
    });
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ mensaje: 'Error al crear empleado', error });
  }
};

// Actualizar un empleado
export const actualizarEmpleado = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nombre, telefono, cargo, salario, puestoId } = req.body;

  try {
    const empleadoActualizado = await prisma.empleado.update({
      where: { id },
      data: {
        nombre,
        telefono,
        cargo,
        salario,
        puestoId: Number(puestoId),
      },
    });
    res.json(empleadoActualizado);
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar empleado', error });
  }
};

// Eliminar un empleado
export const eliminarEmpleado = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.empleado.delete({
      where: { id },
    });
    res.json({ mensaje: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ mensaje: 'Error al eliminar empleado', error });
  }
};
