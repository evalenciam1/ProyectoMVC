import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Vehiculo {
  id?: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  clienteId: number;
  color: string;
}

interface Cliente {
  id: number;
  nombre: string;
}

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Vehiculo>({
    placa: '',
    marca: '',
    modelo: '',
    anio: 2020,
    clienteId: 0,
    color: ''
  });

  const loadVehiculos = async () => {
    const res = await api.get('/vehiculos');
    setVehiculos(res.data);
  };

  const loadClientes = async () => {
    const res = await api.get('/clientes');
    setClientes(res.data);
  };

  useEffect(() => {
    loadVehiculos();
    loadClientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = ['anio', 'clienteId'].includes(name) ? Number(value) : value;
    setForm({ ...form, [name]: parsedValue });
  };

  const handleSubmit = async () => {
    try {
      const method = form.id ? 'put' : 'post';
      const url = form.id ? `/vehiculos/${form.id}` : '/vehiculos';
      await api[method](url, form);
      setShowModal(false);
      resetForm();
      loadVehiculos();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
      alert('Error al guardar vehículo.');
    }
  };

  const resetForm = () => {
    setForm({ placa: '', marca: '', modelo: '', anio: 2020, clienteId: 0, color: '' });
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    setForm(vehiculo);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Deseas eliminar este vehículo?')) {
      await api.delete(`/vehiculos/${id}`);
      loadVehiculos();
    }
  };

  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h2><i className='bi bi-car-front-fill me-2'></i>Vehículos</h2>
        <Button onClick={() => setShowModal(true)}>Agregar Vehículo</Button>
      </div>

      <Table striped bordered hover className='table table-dark'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Color</th>
            <th>Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map(v => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.placa}</td>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.anio}</td>
              <td>{v.color}</td>
              <td>{clientes.find(c => c.id === v.clienteId)?.nombre || '—'}</td>
              <td>
                <Button size="sm" variant="success" onClick={() => handleEdit(v)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(v.id!)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? 'Editar Vehículo' : 'Nuevo Vehículo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Placa</Form.Label>
              <Form.Control name="placa" value={form.placa} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Marca</Form.Label>
              <Form.Control name="marca" value={form.marca} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Modelo</Form.Label>
              <Form.Control name="modelo" value={form.modelo} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Año</Form.Label>
              <Form.Control type="number" name="anio" value={form.anio} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cliente</Form.Label>
              <Form.Select name="clienteId" value={form.clienteId} onChange={handleChange}>
                <option value={0}>Seleccione un cliente</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Color</Form.Label>
              <Form.Control name="color" value={form.color} onChange={handleChange} />
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
