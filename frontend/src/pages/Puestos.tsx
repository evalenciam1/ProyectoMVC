import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';

interface Puesto {
  id?: number;
  nombre: string;
  departamento: string;
  descripcion?: string;
}

export default function Puestos() {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Puesto>({
    nombre: '',
    departamento: '',
    descripcion: '',
  });

  const loadPuestos = async () => {
    const res = await api.get('/puestos');
    setPuestos(res.data);
  };

  useEffect(() => {
    loadPuestos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const method = form.id ? 'put' : 'post';
      const url = form.id ? `/puestos/${form.id}` : '/puestos';
      await api[method](url, form);
      setShowModal(false);
      resetForm();
      loadPuestos();
    } catch (error) {
      console.error('Error al guardar puesto:', error);
      alert('Ocurrió un error al guardar el puesto.');
    }
  };

  const handleEdit = (puesto: Puesto) => {
    setForm(puesto);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Deseas eliminar este puesto?')) {
      await api.delete(`/puestos/${id}`);
      loadPuestos();
    }
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      departamento: '',
      descripcion: '',
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2><i className="bi bi-briefcase me-2"></i>Puestos</h2>
        <Button onClick={() => setShowModal(true)}>Agregar Puesto</Button>
      </div>

      <Table striped bordered hover className="table table-striped table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {puestos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.departamento}</td>
              <td>{p.descripcion || '—'}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(p)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(p.id!)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? 'Editar Puesto' : 'Nuevo Puesto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={form.nombre} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Departamento</Form.Label>
              <Form.Control name="departamento" value={form.departamento} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
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