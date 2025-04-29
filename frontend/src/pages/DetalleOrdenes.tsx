import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

interface Detalle {
  id?: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  ordenTrabajoId: number;
}

export default function DetalleOrdenes() {
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Detalle>({
    ordenTrabajoId: 1,
    descripcion: '',
    cantidad: 0,
    precioUnitario: 0,
  });
  const { ordenId } = useParams<{ ordenId: string }>();

  const loadDetalles = async () => {
    if (!ordenId) return;

    const res = await api.get(`/detalles-orden/orden/${ordenId}`); // ✅ endpoint backend
    setDetalles(res.data);
  };

  const [ordenes, setOrdenes] = useState<
    {
      id: number;
      fecha: string;
      vehiculo: { placa: string; marca: string; modelo: string };
    }[]
  >([]);

  const loadOrdenes = async () => {
    const res = await api.get('/ordenes-trabajo');
    setOrdenes(res.data);
  };

  useEffect(() => {
    loadOrdenes();
    loadDetalles(); // asegúrate de tener también este
  }, []);



  useEffect(() => {
    loadDetalles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = ['ordenTrabajoId', 'cantidad', 'precioUnitario', 'clienteId'];
    setForm({
      ...form,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };
  

  const handleSubmit = async () => {
    if (form.id) {
      await api.put(`/detalles-orden/${form.id}`, form);
    } else {
      await api.post('/detalles-orden', form);
    }
    setShowModal(false);
    resetForm();
    loadDetalles();
  };

  const handleEdit = (detalle: Detalle) => {
    setForm(detalle);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/detalles-orden/${id}`);
    loadDetalles();
  };

  const resetForm = () => {
    setForm({
      ordenTrabajoId: 1,
      descripcion: '',
      cantidad: 1,
      precioUnitario: 1,
    });
  };

  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-between align-items-center mb-3'>
      <h2 className='m0'><i className=" bi-list-check"></i> Detalles de Órdenes de Trabajo</h2>
      <Button onClick={() => setShowModal(true)}>Agregar Detalle</Button>
      </div>
      <Table striped bordered hover className='table table-striped table-dark'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Orden Trabajo ID</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.ordenTrabajoId}</td>
              <td>{d.descripcion}</td>
              <td>{d.cantidad}</td>
              <td>{d.precioUnitario}</td>
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
              <Form.Label>Orden Trabajo</Form.Label>
              <Form.Select
                name="ordenTrabajoId"
                value={form.ordenTrabajoId}
                onChange={handleChange}
              >
                <option value="">Seleccione una orden</option>
                {ordenes.map((orden) => (
                  <option key={orden.id} value={orden.id}>
                    #{orden.id} - {orden.vehiculo.placa} ({orden.vehiculo.marca} {orden.vehiculo.modelo})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control name="cantidad" value={form.cantidad} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>precio Unitario</Form.Label>
              <Form.Control name="precioUnitario" type="number" value={form.precioUnitario} onChange={handleChange} />
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

