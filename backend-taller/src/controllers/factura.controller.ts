import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// Crear factura
export const crearFactura = async (req: Request, res: Response) => {
  const { fechaEmision, descuento, estado, total, pagoId } = req.body;

  try {
    const factura = await prisma.factura.create({
      data: {
        fechaEmision: new Date(fechaEmision),
        descuento: parseFloat(descuento),
        estado,
        total: parseFloat(total),
        pagoId: pagoId ? Number(pagoId) : null,
      },
    });

    res.status(201).json(factura);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear factura', error });
  }
};

// Obtener todas las facturas
export const obtenerFacturas = async (_req: Request, res: Response) => {
  try {
    const facturas = await prisma.factura.findMany({
      include: {
        pago: true,
        ordenes: true,
        detalles: true,
      },
    });

    res.json(facturas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener facturas', error });
  }
};

// Obtener factura por ID
export const obtenerFacturaPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  try {
    const factura = await prisma.factura.findUnique({
      where: { id },
      include: {
        pago: true,
        ordenes: true,
        detalles: true,
      },
    });

    if (!factura) return res.status(404).json({ mensaje: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener factura', error });
  }
};

// Actualizar factura
export const actualizarFactura = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { fechaEmision, descuento, estado, total, pagoId } = req.body;

  try {
    const factura = await prisma.factura.update({
      where: { id },
      data: {
        fechaEmision: new Date(fechaEmision),
        descuento: parseFloat(descuento),
        estado,
        total: parseFloat(total),
        pagoId: pagoId ? Number(pagoId) : null,
      },
    });

    res.json(factura);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar factura', error });
  }
};

// Eliminar factura
export const eliminarFactura = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.factura.delete({ where: { id } });
    res.json({ mensaje: 'Factura eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar factura', error });
  }
};
