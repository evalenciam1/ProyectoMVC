import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

interface OrdenRepuesto {
  id?: number;
  ordenId: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  costoUnitario: number;
}

export default function RepuestosOrden() {
  const { ordenId } = useParams<{ ordenId: string }>();
  const [repuestos, setRepuestos] = useState<OrdenRepuesto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<OrdenRepuesto>({
    ordenId: Number(ordenId),
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
    costoUnitario: 0,
  });

  const loadRepuestos = async () => {
    const res = await api.get(`/repuestos/orden/${ordenId}`);
    setRepuestos(res.data);
  };

  useEffect(() => {
    if (ordenId) {
      loadRepuestos();
    }
  }, [ordenId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['cantidad', 'precioUnitario'];
    setForm({
      ...form,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const calcularCosto = () => {
    return form.cantidad * form.precioUnitario;
  };

  const handleSubmit = async () => {
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/repuestos/${form.id}` : '/repuestos';
    const data = {
      ...form,
      ordenId: Number(ordenId),
      costoUnitario: calcularCosto(),
    };
    await api[method](url, data);
    setShowModal(false);
    setForm({
      ordenId: Number(ordenId),
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      costoUnitario: 0,
    });
    loadRepuestos();
  };

  const handleEdit = (repuesto: OrdenRepuesto) => {
    setForm(repuesto);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/repuestos/${id}`);
    loadRepuestos();
  };

  return (
    <div className="container mt-4">
      <h2>Repuestos de la Orden #{ordenId}</h2>
      <Button className="mb-3" onClick={() => setShowModal(true)}>Agregar Repuesto</Button>

      <Table striped bordered hover className="table table-striped table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Costo Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {repuestos.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.descripcion}</td>
              <td>{r.cantidad}</td>
              <td>Q{Number(r.precioUnitario).toFixed(2)}</td>
              <td>Q{Number(r.costoUnitario).toFixed(2)}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(r)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(r.id!)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? 'Editar Repuesto' : 'Nuevo Repuesto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control type="number" name="cantidad" value={form.cantidad} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Precio Unitario</Form.Label>
              <Form.Control type="number" name="precioUnitario" value={form.precioUnitario} onChange={handleChange} />
            </Form.Group>
            <Form.Text className="text-muted">
              Costo total: Q{calcularCosto().toFixed(2)}
            </Form.Text>
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