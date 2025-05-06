import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Factura {
  id?: number;
  fechaEmision: string;
  descuento: number;
  estado: string;
  total: number;
  pagoId?: number | null;
}

export default function FacturaPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Factura>({
    fechaEmision: '',
    descuento: 0,
    estado: '',
    total: 0,
    pagoId: null,
  });

  const navigate = useNavigate();
  const isEditing = !!form.id;

  const loadFacturas = async () => {
    try {
      const { data } = await api.get('/facturas');
      setFacturas(data);
    } catch (error) {
      console.error('Error al cargar facturas', error);
    }
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'total') return; // evitar modificación manual
    setForm((prev) => ({
      ...prev,
      [name]: name === 'descuento' ? parseFloat(value) || 0 : value,
    }));
  };

  const resetForm = () => {
    setForm({
      fechaEmision: '',
      descuento: 0,
      estado: '',
      total: 0,
      pagoId: null,
    });
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const facturaData = {
      fechaEmision: form.fechaEmision,
      descuento: form.descuento,
      estado: form.estado,
      pagoId: form.pagoId ?? null,
      total: 0,
    };

    try {
      if (isEditing) {
        await api.put(`/facturas/${form.id}`, facturaData);
      } else {
        await api.post('/facturas', facturaData);
      }
      await loadFacturas();
      resetForm();
    } catch (error) {
      console.error('Error al guardar factura', error);
    }
  };

  const handleEdit = (factura: Factura) => {
    setForm({
      ...factura,
      total: Number(factura.total),        // conversión explícita
      descuento: Number(factura.descuento), // por si también es Decimal
      fechaEmision: factura.fechaEmision?.split('T')[0] ?? '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar esta factura?')) {
      try {
        await api.delete(`/facturas/${id}`);
        await loadFacturas();
      } catch (error) {
        console.error('Error al eliminar factura', error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0"><i className="bi bi-receipt"></i> Facturas</h2>
        <Button onClick={() => setShowModal(true)}>Agregar Factura</Button>
      </div>

      <Table striped bordered hover className="table table-striped table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Descuento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.fechaEmision?.split('T')[0]}</td>
              <td>Q{Number(f.total || 0).toFixed(2)}</td>
              <td>{f.estado}</td>
              <td>Q{Number(f.descuento || 0).toFixed(2)}</td>
              <td>
                <Button size="sm" variant="info" onClick={() => navigate(`/detalles-factura/${f.id}`)}>Detalle</Button>{' '}
                <Button size="sm" variant="success" onClick={() => handleEdit(f)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(f.id!)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Factura' : 'Nueva Factura'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Emisión</Form.Label>
              <Form.Control
                type="date"
                name="fechaEmision"
                value={form.fechaEmision}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                name="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="Pendiente, Pagado, etc."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descuento (Q)</Form.Label>
              <Form.Control
                type="number"
                name="descuento"
                min={0}
                step="0.01"
                value={form.descuento}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total (Q)</Form.Label>
              <Form.Control
                type="number"
                name="total"
                value={Number(form.total).toFixed(2)}
                readOnly
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
