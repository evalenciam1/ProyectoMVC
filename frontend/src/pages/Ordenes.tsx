import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';


interface Orden {
  id?: number;
  vehiculoId: number;
  estado: string;
  clienteId: number;
  descripcion: string;
}

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Orden>({
    vehiculoId: 1,
    estado: 'Pendiente',
    descripcion: '',
    clienteId: 1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrdenes = async () => {
      const { data } = await api.get('/ordenes-trabajo');
      setOrdenes(data);
    };
    loadOrdenes();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const parsedValue = ['vehiculoId', 'clienteId'].includes(name)
      ? Number(value)
      : value;
    setForm({ ...form, [name]: parsedValue });
  };  

  const handleSubmit = async () => {
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/ordenes-trabajo/${form.id}` : '/ordenes-trabajo';
    await api[method](url, form);
    setShowModal(false);
    setForm({
      vehiculoId: 1,
      clienteId: 1,
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

  

  return (
    <div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h2 className="m-0"><i className="bi bi-file-earmark-spreadsheet"></i>  Órdenes de Trabajo</h2>
    <Button onClick={() => setShowModal(true)}>Agregar Orden</Button>
  </div>
      <Table striped bordered hover className='table table-striped table-dark'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehículo ID</th>
            <th>Cliente ID</th>
            <th>Estado</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.vehiculoId}</td>
              <td>{o.clienteId}</td>
              <td>{o.estado}</td>
              <td>{o.descripcion}</td>
              <td>
                <Button size="sm" variant="info"  onClick={() => navigate(`/detalles/${o.id}`)}>Servicios</Button>{' '}
                <Button size="sm" variant="info"  onClick={() => navigate(`/repuestos/${o.id}`)}>Repuestos</Button>{' '}
                <Button size="sm" variant="success" onClick={() => handleEdit(o)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(o.id!)}>Eliminar</Button>
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
              <Form.Label>Vehículo ID</Form.Label>
              <Form.Control name="vehiculoId" type="number" value={form.vehiculoId} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cliente ID</Form.Label>
              <Form.Control name="clienteId" type="number" value={form.clienteId} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select name="estado" value={form.estado} onChange={handleChange}>
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Finalizado">Finalizado</option>
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
