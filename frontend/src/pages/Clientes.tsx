import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { cleanData } from '../utils/cleanData';

interface Cliente {
  id?: number;
  nombre: string;
  direccion: string;
  email: string;
  telefono: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Cliente>({ nombre: '', direccion: '', telefono: '', email: '' });

  const isEditing = !!form.id;

  const loadClientes = async () => {
    try {
      const { data } = await api.get('/clientes');
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes', error);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ nombre: '', direccion: '', telefono: '' , email: ''});
    setShowModal(false);
  };

  const handleSubmit = async () => {

          const clientesData = cleanData(form, [
            'nombre',
            'direccion',
            'telefono',
            'email',
          ]);


    try {
      if (isEditing) {
    //    console.log(data);
        await api.put(`/clientes/${form.id}`, clientesData);
      } else {
        await api.post('/clientes', clientesData);
      }
      await loadClientes();
      resetForm();
    } catch (error) {
      console.error('Error al guardar cliente', error);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setForm(cliente);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await api.delete(`/clientes/${id}`);
        await loadClientes();
      } catch (error) {
        console.error('Error al eliminar cliente', error);
      }
    }
  };

  return (
    <div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h2 className="m-0"><i className="bi-file-earmark-text "></i>  Clientes</h2>
    <Button onClick={() => setShowModal(true)}>Agregar Cliente</Button>
  </div>

      <Table striped bordered hover className='table table-striped table-dark'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.direccion}</td>
              <td>{c.email}</td>
              <td>{c.telefono}</td>
              <td>
                <Button size="sm" variant="success" onClick={() => handleEdit(c)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(c.id!)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {['nombre', 'direccion', 'email', 'telefono'].map((field) => (
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
