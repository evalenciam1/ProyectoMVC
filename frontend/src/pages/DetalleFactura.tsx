import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';

interface DetalleFactura {
  id?: number;
  facturaId: number;
  pagoId?: number | null;
  ordenId: number;
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
  subtotal: number;
}

export default function DetalleFacturaPage() {
  const { facturaId } = useParams<{ facturaId: string }>();
  const [detalles, setDetalles] = useState<DetalleFactura[]>([]);
  const [form, setForm] = useState<DetalleFactura>({
    facturaId: Number(facturaId),
    pagoId: null,
    ordenId: 1,
    cantidad: 1,
    descripcion: '',
    precioUnitario: 0,
    subtotal: 0,
  });
  const [showModal, setShowModal] = useState(false);

  const loadDetalles = async () => {
    const { data } = await api.get(`/detalle-factura`);
    const filtrados = data.filter((d: DetalleFactura) => d.facturaId === Number(facturaId));
    setDetalles(filtrados);
  };

  useEffect(() => {
    if (facturaId) {
      loadDetalles();
    }
  }, [facturaId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const parsed =
      ['facturaId', 'pagoId', 'ordenId', 'cantidad', 'precioUnitario'].includes(name)
        ? Number(value)
        : value;
    setForm(prev => ({ ...prev, [name]: parsed }));
  };

  const handleSubmit = async () => {
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/detalle-factura/${form.id}` : '/detalle-factura';

    const detalle: DetalleFactura = {
      ...form,
      facturaId: Number(facturaId),
      subtotal: form.cantidad * form.precioUnitario,
    };

    await api[method](url, detalle);
    setShowModal(false);
    setForm({
      facturaId: Number(facturaId),
      pagoId: null,
      ordenId: 1,
      cantidad: 1,
      descripcion: '',
      precioUnitario: 0,
      subtotal: 0,
    });
    loadDetalles();
  };

  const handleEdit = (detalle: DetalleFactura) => {
    setForm(detalle);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/detalle-factura/${id}`);
    loadDetalles();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Detalles de Factura #{facturaId}</h2>
        <Button onClick={() => setShowModal(true)}>Agregar Detalle</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Orden ID</th>
            <th>Cantidad</th>
            <th>Descripción</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.ordenId}</td>
              <td>{d.cantidad}</td>
              <td>{d.descripcion}</td>
              <td>Q{Number(d.precioUnitario).toFixed(2)}</td>
              <td>Q{Number(d.subtotal).toFixed(2)}</td>
              <td>
                <Button size="sm" variant="success" onClick={() => handleEdit(d)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(d.id!)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? 'Editar Detalle' : 'Nuevo Detalle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Orden ID</Form.Label>
              <Form.Control name="ordenId" type="number" value={form.ordenId} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control name="cantidad" type="number" value={form.cantidad} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control name="descripcion" type="text" value={form.descripcion} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio Unitario</Form.Label>
              <Form.Control name="precioUnitario" type="number" step="0.01" value={form.precioUnitario} onChange={handleChange} />
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
