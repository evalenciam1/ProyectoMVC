import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

// Función para recalcular el total de una factura

const recalcularTotalFactura = async (facturaId: number) => {
  console.log('Recalculando total para factura', facturaId); // <-- AÑADE ESTO

  const detalles = await prisma.detalleFactura.findMany({
    where: { facturaId },
  });
  const total = detalles.reduce((sum, d) => {
    const subtotalNumber = typeof d.subtotal === 'string' ? parseFloat(d.subtotal) : d.subtotal.toNumber();
    return sum + subtotalNumber;
  }, 0);

  await prisma.factura.update({
    where: { id: facturaId },
    data: { total: new Prisma.Decimal(total) },
  });
};


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

    await recalcularTotalFactura(Number(facturaId));

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

// Obtener detalles por facturaId (para frontend)
export const obtenerDetallesPorFacturaId = async (req: Request, res: Response) => {
  const facturaId = Number(req.params.facturaId);

  try {
    const detalles = await prisma.detalleFactura.findMany({
      where: { facturaId },
    });

    res.json(detalles);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener detalles por factura', error });
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

    await recalcularTotalFactura(Number(facturaId));

    res.json(detalle);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar detalle', error });
  }
};

// Eliminar detalle
export const eliminarDetalleFactura = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const detalleExistente = await prisma.detalleFactura.findUnique({ where: { id } });

    if (!detalleExistente) {
      return res.status(404).json({ mensaje: 'Detalle no encontrado' });
    }

    await prisma.detalleFactura.delete({ where: { id } });

    await recalcularTotalFactura(detalleExistente.facturaId);

    res.json({ mensaje: 'Detalle de factura eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar detalle', error });
  }
};
