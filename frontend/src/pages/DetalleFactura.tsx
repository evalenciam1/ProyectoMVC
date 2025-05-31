import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { Table, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DetalleFactura {
  id: number;
  facturaId: number;
  ordenId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  descripcion?: string;
}

interface Cliente {
  nombre: string;
}

interface VehiculoDetalle {
  placa: string;
  marca: string;
  modelo: string;
  cliente?: Cliente;
}

interface OrdenConVehiculo {
  vehiculo?: VehiculoDetalle;
}

interface Factura {
  id: number;
  fechaEmision: string;
  descuento: number | string;
  estado: string;
  total: number | string;
  ordenes?: OrdenConVehiculo[];
}

export default function DetalleFactura() {
  const { facturaId } = useParams();
  const navigate = useNavigate();
  const [detalles, setDetalles] = useState<DetalleFactura[]>([]);
  const [factura, setFactura] = useState<Factura | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: detallesData } = await api.get(`/detalle-factura?facturaId=${facturaId}`);
      setDetalles(detallesData);

      const { data: facturaData } = await api.get(`/facturas/${facturaId}`);
      setFactura(facturaData);
    };

    fetchData();
  }, [facturaId]);

  const generarPDF = () => {
    if (!factura) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Factura #${factura.id}`, 14, 15);

    doc.setFontSize(12);
    doc.text(`Fecha: ${factura.fechaEmision.split('T')[0]}`, 14, 25);
    doc.text(`Estado: ${factura.estado}`, 14, 32);
    doc.text(`Descuento: Q${Number(factura.descuento).toFixed(2)}`, 14, 39);
    doc.text(`Total: Q${Number(factura.total).toFixed(2)}`, 14, 46);

    const orden = factura.ordenes?.[0];
    const vehiculo = orden?.vehiculo;
    const cliente = vehiculo?.cliente;

    if (cliente) doc.text(`Cliente: ${cliente.nombre}`, 14, 53);
    if (vehiculo) {
      doc.text(`Vehículo: ${vehiculo.marca} ${vehiculo.modelo}`, 14, 60);
      doc.text(`Placa: ${vehiculo.placa}`, 14, 67);
    }

    autoTable(doc, {
      startY: 75,
      head: [['ID', 'Orden', 'Descripción', 'Cantidad', 'Precio Unitario', 'Subtotal']],
      body: detalles.map((d) => [
        d.id,
        d.ordenId,
        d.descripcion || '-',
        d.cantidad,
        `Q${Number(d.precioUnitario).toFixed(2)}`,
        `Q${Number(d.subtotal).toFixed(2)}`,
      ]),
    });

    doc.save(`factura_${factura.id}.pdf`);
  };

  const vehiculo = factura?.ordenes?.[0]?.vehiculo;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2><i className="bi bi-receipt"></i> Detalles de Factura #{facturaId}</h2>
        <Button variant="secondary" onClick={() => navigate('/facturas')}>
          Volver a Facturas
        </Button>
      </div>

      {factura && (
        <div className="mb-4">
          <p><strong>Fecha de Emisión:</strong> {factura.fechaEmision.split('T')[0]}</p>
          <p><strong>Estado:</strong> {factura.estado}</p>
          <p><strong>Descuento:</strong> Q{Number(factura.descuento).toFixed(2)}</p>
          <p><strong>Total:</strong> Q{Number(factura.total).toFixed(2)}</p>
          <hr />
          <p><strong>Cliente:</strong> {vehiculo?.cliente?.nombre ?? 'No disponible'}</p>
          <p><strong>Vehículo:</strong> {vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'No disponible'}</p>
          <p><strong>Placa:</strong> {vehiculo?.placa ?? 'No disponible'}</p>

          <Button variant="warning" onClick={generarPDF}>
            Generar PDF
          </Button>
        </div>
      )}

      <Table striped bordered hover className="table table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Orden</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.ordenId}</td>
              <td>{d.descripcion || '-'}</td>
              <td>{d.cantidad}</td>
              <td>Q{Number(d.precioUnitario).toFixed(2)}</td>
              <td>Q{Number(d.subtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
