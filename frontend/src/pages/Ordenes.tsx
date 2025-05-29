import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Orden {
  id?: number;
  fecha?: Date;
  vehiculoId: number;
  estado: string;
  descripcion: string;
  vehiculo?: {
    placa: string;
    marca: string;
    modelo: string;
  };
}

interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
}

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Orden>({
    vehiculoId: 1,
    estado: 'Pendiente',
    descripcion: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadOrdenes = async () => {
      const { data } = await api.get('/ordenes-trabajo');
      setOrdenes(data);
    };

    const loadVehiculos = async () => {
      const { data } = await api.get('/vehiculos');
      setVehiculos(data);
    };

    loadOrdenes();
    loadVehiculos();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const parsedValue = name === 'vehiculoId' ? Number(value) : value;
    setForm({ ...form, [name]: parsedValue });
  };

  const handleSubmit = async () => {
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/ordenes-trabajo/${form.id}` : '/ordenes-trabajo';
    await api[method](url, form);
    setShowModal(false);
    setForm({
      vehiculoId: 1,
      estado: 'Pendiente',
      descripcion: '',
    });
    const { data } = await api.get('/ordenes-trabajo');
    setOrdenes(data);
  };

  const handleEdit = (orden: Orden) => {
    setForm(orden);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/ordenes-trabajo/${id}`);
    const { data } = await api.get('/ordenes-trabajo');
    setOrdenes(data);
  };

  const handleGenerarFactura = async (id: number) => {
    try {
      const { data } = await api.post(`/facturas/generar-desde-orden/${id}`);
      alert(data.mensaje || 'Factura generada correctamente');
      const facturaId = data.factura.id;
      navigate(`/detalles-factura/${facturaId}`);
    } catch (error) {
      console.error(error);
      alert('Error al generar la factura');
    }
  };


  //Generacion de PDF de ordenes
  const generarPDF = () => {
    if (!ordenes) return;

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text(`Ordenes`, 14, 15);
    pdf.setFontSize(12);
    pdf.text('Este es el detalle de ordenes abiertas', 14, 30);


    autoTable(pdf, {
      startY: 50,
      head: [['ID', 'Fecha', 'Placa', 'Marca', 'Descripcion', 'Estado']],
      body: ordenes.map((d) => [
        d.id,
        new Date(d.fecha).toLocaleDateString('es-ES'),
        d.vehiculo?.placa,
        d.vehiculo?.marca,
        d.descripcion,
        d.estado,
      ]),
    });

    pdf.save(`ordenes.pdf`);
  };


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0"><i className="bi bi-file-earmark-spreadsheet"></i> Órdenes de Trabajo</h2>
        <Button onClick={() => setShowModal(true)}>Agregar Orden</Button>
        <Button variant="warning" onClick={generarPDF}>
          Generar PDF
        </Button>
      </div>

      <Table striped bordered hover className="table table-striped table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Vehículo</th>
            <th>Estado</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{new Date(o.fecha).toLocaleDateString('es-ES')}</td>
              <td>
                {o.vehiculo
                  ? `${o.vehiculo.placa} - ${o.vehiculo.marca} ${o.vehiculo.modelo}`
                  : `ID ${o.vehiculoId}`}
              </td>
              <td>{o.estado}</td>
              <td>{o.descripcion}</td>
              <td>
                <Button size="sm" variant="info" onClick={() => navigate(`/detalles/${o.id}`)}>Servicios</Button>{' '}
                <Button size="sm" variant="info" onClick={() => navigate(`/repuestos/${o.id}`)}>Repuestos</Button>{' '}
                <Button size="sm" variant="success" onClick={() => handleEdit(o)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(o.id!)}>Eliminar</Button>{' '}
                <Button
                  size="sm"
                  variant="primary"
                  className="mt-1"
                  onClick={() => handleGenerarFactura(o.id!)}
                  disabled={o.estado.toLowerCase() === 'facturado'}
                >
                  Generar Factura
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? 'Editar Orden' : 'Nueva Orden'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Vehículo</Form.Label>
              <Form.Select name="vehiculoId" value={form.vehiculoId} onChange={handleChange}>
                <option value="">Seleccione un vehículo</option>
                {vehiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} - {v.marca} {v.modelo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select name="estado" value={form.estado} onChange={handleChange}>
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="facturado">Facturado</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Descripcion</Form.Label>
              <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}