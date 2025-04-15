import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { cleanData } from '../utils/cleanData';

interface Vehiculo {
  id?: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  clienteId: number;
  color: string;
}

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Vehiculo>({ placa: '', marca: '', modelo: '', anio: 2020, clienteId: 1, color: '' });

  const loadVehiculos = async () => {
    const res = await api.get('/vehiculos');
    setVehiculos(res.data);
  };

  useEffect(() => {
    loadVehiculos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    const parsedValue = ['anio', 'clienteId'].includes(name)
      ? Number(value)
      : value;
  
    setForm({ ...form, [name]: parsedValue });
  };

  const handleSubmit = async () => {
    try {
      const method = form.id ? 'put' : 'post';
      const url = form.id ? `/vehiculos/${form.id}` : '/vehiculos';
  
      // ✅ Usamos cleanData para dejar solo los campos válidos
      const vehiculoData = cleanData(form, [
        'placa',
        'marca',
        'modelo',
        'anio',
        'clienteId',
        'color',
      ]);
  
      await api[method](url, vehiculoData);
  
      setShowModal(false);
      setForm({ placa: '', marca: '', modelo: '', anio: 2020, clienteId: 1, color: '' });
      loadVehiculos();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
      alert('Ocurrió un error al guardar el vehículo. Intenta nuevamente.');
    }
  };


  const handleEdit = (vehiculo: Vehiculo) => {
    setForm(vehiculo);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/vehiculos/${id}`);
    loadVehiculos();
  };

  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-between align-items-center mb-3'>
      <h2 className='m0'><i className='bi bi-car-front-fill'></i>  Vehículos</h2>
      <Button className="mb-2" onClick={() => setShowModal(true)}>Agregar Vehículo</Button>
      </div>
      <Table striped bordered hover className='table table-striped table-dark'>
        <thead className="thead-light">
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
              <td>{v.clienteId}</td>
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
            <Form.Group>
              <Form.Label>Placa</Form.Label>
              <Form.Control name="placa" value={form.placa} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Marca</Form.Label>
              <Form.Control name="marca" value={form.marca} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Modelo</Form.Label>
              <Form.Control name="modelo" value={form.modelo} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Año</Form.Label>
              <Form.Control name="anio" type="number" value={form.anio} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cliente ID</Form.Label>
              <Form.Control name="clienteId" type="number" value={form.clienteId} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Color</Form.Label>
              <Form.Control name="color"  value={form.color} onChange={handleChange} />
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
