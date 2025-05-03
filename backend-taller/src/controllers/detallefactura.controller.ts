import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// Crear detalle de factura
export const crearDetalleFactura = async (req: Request, res: Response) => {
  const { facturaId, pagoId, ordenId, cantidad, precioUnitario, subtotal } = req.body;

  try {
    const detalle = await prisma.detalleFactura.create({
      data: {
        facturaId: Number(facturaId),
        pagoId: pagoId ? Number(pagoId) : null,
        ordenId: Number(ordenId),
        cantidad: Number(cantidad),
        precioUnitario: parseFloat(precioUnitario),
        subtotal: parseFloat(subtotal),
      },
    });

    res.status(201).json(detalle);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear detalle de factura', error });
  }
};

// Obtener todos los detalles
export const obtenerDetallesFactura = async (_req: Request, res: Response) => {
  try {
    const detalles = await prisma.detalleFactura.findMany({
      include: {
        factura: true,
        pago: true,
        orden: true,
      },
    });

    res.json(detalles);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener detalles', error });
  }
};

// Obtener detalle por ID
export const obtenerDetalleFacturaPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const detalle = await prisma.detalleFactura.findUnique({
      where: { id },
      include: {
        factura: true,
        pago: true,
        orden: true,
      },
    });

    if (!detalle) return res.status(404).json({ mensaje: 'Detalle no encontrado' });
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener detalle', error });
  }
};

// Actualizar detalle de factura
export const actualizarDetalleFactura = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { facturaId, pagoId, ordenId, cantidad, precioUnitario, subtotal } = req.body;

  try {
    const detalle = await prisma.detalleFactura.update({
      where: { id },
      data: {
        facturaId: Number(facturaId),
        pagoId: pagoId ? Number(pagoId) : null,
        ordenId: Number(ordenId),
        cantidad: Number(cantidad),
        precioUnitario: parseFloat(precioUnitario),
        subtotal: parseFloat(subtotal),
      },
    });

    res.json(detalle);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar detalle', error });
  }
};

// Eliminar detalle
export const eliminarDetalleFactura = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.detalleFactura.delete({ where: { id } });
    res.json({ mensaje: 'Detalle de factura eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar detalle', error });
  }
};
