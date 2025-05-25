import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

// Función para calcular el total basado en detalles
const calcularTotalDesdeDetalles = async (facturaId: number) => {
  const detalles = await prisma.detalleFactura.findMany({
    where: { facturaId },
  });

  const subtotal = detalles.reduce((sum, d) => {
    const valor = typeof d.subtotal === 'string' ? parseFloat(d.subtotal) : d.subtotal.toNumber();
    return sum + valor;
  }, 0);

  return new Prisma.Decimal(subtotal);
};

// Crear factura con descuento aplicado al total
export const crearFactura = async (req: Request, res: Response) => {
  const { fechaEmision, descuento, estado, pagoId } = req.body;

  try {
    const factura = await prisma.factura.create({
      data: {
        fechaEmision: new Date(fechaEmision),
        descuento: new Prisma.Decimal(descuento),
        estado,
        total: new Prisma.Decimal(0), // se actualizará después
        pagoId: pagoId ? Number(pagoId) : null,
      },
    });

    const subtotal = await calcularTotalDesdeDetalles(factura.id);
    const totalFinal = subtotal.minus(descuento ?? 0);

    const facturaActualizada = await prisma.factura.update({
      where: { id: factura.id },
      data: {
        total: totalFinal.greaterThan(0) ? totalFinal : new Prisma.Decimal(0),
      },
    });

    res.status(201).json(facturaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear factura', error });
  }
};

// Obtener todas las facturas con detalles relacionados
export const obtenerFacturas = async (_req: Request, res: Response) => {
  try {
    const facturas = await prisma.factura.findMany({
      include: {
        pago: true,
        ordenes: {
          include: {
            vehiculo: {
              include: { cliente: true },
            },
          },
        },
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
        detalles: true,
        ordenes: {
          include: {
            vehiculo: {
              include: { cliente: true },
            },
          },
        },
      },
    });

    if (!factura) return res.status(404).json({ mensaje: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener factura', error });
  }
};

// Actualizar factura y recalcular total
export const actualizarFactura = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ mensaje: 'ID inválido' });

  const { fechaEmision, descuento, estado, pagoId } = req.body;

  try {
    const subtotal = await calcularTotalDesdeDetalles(id);
    const total = subtotal.minus(descuento ?? 0);

    const factura = await prisma.factura.update({
      where: { id },
      data: {
        fechaEmision: fechaEmision ? new Date(fechaEmision) : undefined,
        descuento: new Prisma.Decimal(descuento),
        estado,
        total: total.greaterThan(0) ? total : new Prisma.Decimal(0),
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

// Generar factura automáticamente desde una orden de trabajo
export const generarFacturaDesdeOrden = async (req: Request<{ ordenId: string }>, res: Response) => {
  const ordenId = Number(req.params.ordenId);
  if (isNaN(ordenId)) return res.status(400).json({ mensaje: 'ID de orden inválido' });

  try {
    const orden = await prisma.ordenTrabajo.findUnique({
      where: { id: ordenId },
      include: {
        detalles: true,
        repuestos: true,
      },
    });

    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    if (orden.facturaId) return res.status(400).json({ mensaje: 'La orden ya tiene factura' });

    const subtotalServicios = orden.detalles.reduce((sum, s) => sum + s.cantidad * Number(s.precioUnitario), 0);
    const subtotalRepuestos = orden.repuestos.reduce((sum, r) => sum + r.cantidad * Number(r.precioUnitario), 0);
    const subtotal = subtotalServicios + subtotalRepuestos;

    const factura = await prisma.factura.create({
      data: {
        fechaEmision: new Date(),
        descuento: new Prisma.Decimal(0),
        estado: 'pendiente',
        total: new Prisma.Decimal(subtotal),
        ordenes: {
          connect: { id: orden.id },
        },
      },
    });

    for (const s of orden.detalles) {
      await prisma.detalleFactura.create({
        data: {
          facturaId: factura.id,
          ordenId: orden.id,
          cantidad: s.cantidad,
          descripcion: s.descripcion,
          precioUnitario: s.precioUnitario,
          subtotal: new Prisma.Decimal(s.cantidad * Number(s.precioUnitario)),
        },
      });
    }

    for (const r of orden.repuestos) {
      await prisma.detalleFactura.create({
        data: {
          facturaId: factura.id,
          ordenId: orden.id,
          cantidad: r.cantidad,
          descripcion: r.descripcion,
          precioUnitario: r.precioUnitario,
          subtotal: new Prisma.Decimal(r.cantidad * Number(r.precioUnitario)),
        },
      });
    }

    await prisma.ordenTrabajo.update({
      where: { id: orden.id },
      data: {
        facturaId: factura.id,
        estado: 'facturado',
      },
    });

    res.status(201).json({ mensaje: 'Factura generada correctamente', factura });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al generar factura', error });
  }
};
