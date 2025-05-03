import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { cleanData } from '../utils/cleanData';

interface Puesto {
  id?: number;
  nombre: string;
  departamento: string;
  descripcion?: string;
}

export default function Puestos() {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Puesto>({ nombre: '', departamento: '', descripcion: '' });

  const isEditing = !!form.id;

  const loadPuestos = async () => {
    const { data } = await api.get('/puestos');
    setPuestos(data);
  };

  useEffect(() => {
    loadPuestos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ nombre: '', departamento: '', descripcion: '' });
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const data = cleanData(form, ['nombre', 'departamento', 'descripcion']);
    try {
      if (isEditing) {
        await api.put(`/puestos/${form.id}`, data);
      } else {
        await api.post('/puestos', data);
      }
      await loadPuestos();
      resetForm();
    } catch (error) {
      console.error('Error al guardar puesto', error);
    }
  };

  const handleEdit = (puesto: Puesto) => {
    setForm(puesto);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este puesto?')) {
      await api.delete(`/puestos/${id}`);
      await loadPuestos();
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2><i className="bi-briefcase"></i> Puestos</h2>
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
          {puestos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.departamento}</td>
              <td>{p.descripcion}</td>
              <td>
                <Button size="sm" variant="success" onClick={() => handleEdit(p)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(p.id!)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Puesto' : 'Nuevo Puesto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {['nombre', 'departamento', 'descripcion'].map((field) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
