import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        puestoId,
      },
    });
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el empleado." });
  }
};

// Obtener todos los empleados
export const obtenerEmpleados = async (_req: Request, res: Response) => {
  try {
    const empleados = await prisma.empleado.findMany({
      include: {
        puesto: true,
        servicios: true, // trabajos realizados por el empleado
      },
    });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los empleados." });
  }
};

// Obtener empleado por ID
export const obtenerEmpleadoPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const empleado = await prisma.empleado.findUnique({
      where: { id: idNumber },
      include: {
        puesto: true,
        servicios: true,
      },
    });

    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el empleado.' });
  }
};

// Actualizar empleado
export const actualizarEmpleado = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, telefono, cargo, salario, puestoId } = req.body;

  try {
    const empleadoActualizado = await prisma.empleado.update({
      where: { id: Number(id) },
      data: {
        nombre,
        telefono,
        cargo,
        salario,
        puestoId,
      },
    });
    res.json(empleadoActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el empleado." });
  }
};

// Eliminar empleado
export const eliminarEmpleado = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.empleado.delete({
      where: { id: Number(id) },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el empleado." });
  }
};
