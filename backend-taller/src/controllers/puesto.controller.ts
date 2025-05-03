import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear un puesto
export const crearPuesto = async (req: Request, res: Response) => {
  const { nombre, departamento, descripcion } = req.body;

  try {
    const puesto = await prisma.puesto.create({
      data: {
        nombre,
        departamento,
        descripcion,
      },
    });

    res.status(201).json(puesto);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el puesto." });
  }
};

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
    res.status(500).json({ error: "Error al obtener los puestos." });
  }
};

// Obtener un puesto por ID
export const obtenerPuestoPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return res.status(400).json({ mensaje: "ID inválido" });
  }

  try {
    const puesto = await prisma.puesto.findUnique({
      where: { id: idNumber },
      include: {
        empleados: true,
      },
    });

    if (!puesto) return res.status(404).json({ mensaje: "Puesto no encontrado" });

    return res.json(puesto);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener el puesto" });
  }
};

// Actualizar un puesto
export const actualizarPuesto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, departamento, descripcion } = req.body;

  try {
    const puesto = await prisma.puesto.update({
      where: { id: Number(id) },
      data: {
        nombre,
        departamento,
        descripcion,
      },
    });

    res.json(puesto);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el puesto." });
  }
};

// Eliminar un puesto
export const eliminarPuesto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.puesto.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el puesto." });
  }
};
