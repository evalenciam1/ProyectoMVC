import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

// Crear cliente
export const crearCliente = async (req: Request, res: Response) => {
  const { nombre, telefono, email, direccion } = req.body;

  if (!nombre || !telefono || !email || !direccion) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const nuevoCliente = await prisma.cliente.create({
      data: { nombre, telefono, email, direccion },
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al crear cliente', details: error });
  }
};

// Obtener todos los clientes
export const obtenerClientes = async (_req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: { vehiculos: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes', details: error });
  }
};

// Obtener cliente por ID
export const obtenerClientePorId = async (req: Request, res: Response): Promise<Response> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: { vehiculos: true },
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    return res.json(cliente);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener cliente', error });
  }
};

// Eliminar cliente
export const eliminarCliente = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const clienteEliminado = await prisma.cliente.delete({
      where: { id },
    });

    res.status(200).json({
      mensaje: 'Cliente eliminado correctamente',
      cliente: clienteEliminado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar el cliente',
      error,
    });
  }
};

// Actualizar cliente
export const actualizarCliente = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  const { nombre, telefono, email, direccion } = req.body;

  try {
    const clienteActualizado = await prisma.cliente.update({
      where: { id },
      data: { nombre, telefono, email, direccion },
    });

    res.status(200).json({
      mensaje: 'Cliente actualizado correctamente',
      cliente: clienteActualizado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar el cliente',
      error,
    });
  }
};