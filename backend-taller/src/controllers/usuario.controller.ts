import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const crearUsuario = async (req: Request, res: Response) => {
  const { nombre, email, password, rol } = req.body;

  try {
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password,rol,
      },
    });

    // Aquí puedes agregar lógica adicional si es necesario
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario." });
  }
}

export const obtenerUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios." });
  }
};

export const obtenerUsPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: idNumber } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener usuario', error });
  }
};



export const actualizarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, email, password, rol } = req.body;

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nombre,
        email,
        password,
        rol,
      },
    });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario." });
  }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario." });
  }
};

