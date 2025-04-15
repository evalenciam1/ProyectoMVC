import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const crearCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await prisma.cliente.create({
      data: req.body,
    });
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente', details: error });
  }
};

export const obtenerClientes = async (_req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: { vehiculos: true },
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};


export const obtenerClientePorId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) }
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    return res.json(cliente);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener cliente', error });
  }
};

// ✅ Eliminar cliente por ID
export const eliminarCliente = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const clienteEliminado = await prisma.cliente.delete({
      where: { id: Number(id) },
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

// ✅ Actualizar cliente por ID
export const actualizarCliente = async (req: Request, res: Response) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  try {
    const clienteActualizado = await prisma.cliente.update({
      where: { id: Number(id) },
      data: datosActualizados,
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