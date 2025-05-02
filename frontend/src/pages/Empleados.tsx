import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';

interface Empleado {
  id?: number;
  nombre: string;
  telefono?: string;
  cargo: string;
  salario: number;
  puestoId: number;
}

interface Puesto {
  id: number;
  nombre: string;
}

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Empleado>({
    nombre: '',
    telefono: '',
    cargo: '',
    salario: 0,
    puestoId: 0,
  });

  const loadEmpleados = async () => {
    const res = await api.get('/empleados');
    setEmpleados(res.data);
  };

  const loadPuestos = async () => {
    const res = await api.get('/puestos');
    setPuestos(res.data);
  };

  useEffect(() => {
    loadEmpleados();
    loadPuestos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['salario', 'puestoId'];
    setForm({
      ...form,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      telefono: '',
      cargo: '',
      salario: 0,
      puestoId: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      const method = form.id ? 'put' : 'post';
      const url = form.id ? `/empleados/${form.id}` : '/empleados';
      await api[method](url, form);
      setShowModal(false);
      resetForm();
      loadEmpleados();
    } catch (error) {
      console.error('Error al guardar empleado:', error);
      alert('Ocurrió un error al guardar el empleado.');
    }
  };

  const handleEdit = (empleado: Empleado) => {
    setForm(empleado);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Deseas eliminar este empleado?')) {
      await api.delete(`/empleados/${id}`);
      loadEmpleados();
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2><i className="bi bi-person-workspace me-2"></i>Empleados</h2>
        <Button onClick={() => setShowModal(true)}>Agregar Empleado</Button>
      </div>

      <Table striped bordered hover className="table table-striped table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Cargo</th>
            <th>Salario</th>
            <th>Puesto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nombre}</td>
              <td>{e.telefono || '-'}</td>
              <td>{e.cargo}</td>
              <td>Q{Number(e.salario).toFixed(2)}</td>
              <td>{puestos.find(p => p.id === e.puestoId)?.nombre || '—'}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(e)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(e.id!)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? 'Editar Empleado' : 'Nuevo Empleado'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={form.nombre} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control name="telefono" value={form.telefono} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cargo</Form.Label>
              <Form.Control name="cargo" value={form.cargo} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Salario</Form.Label>
              <Form.Control type="number" name="salario" value={form.salario} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Puesto</Form.Label>
              <Form.Select name="puestoId" value={form.puestoId} onChange={handleChange}>
                <option value={0}>Seleccione un puesto</option>
                {puestos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </Form.Select>
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