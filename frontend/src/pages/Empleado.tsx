import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { cleanData } from '../utils/cleanData';

interface Empleado {
  id?: number;
  nombre: string;
  telefono?: string;
  cargo: string;
  salario: number;
  puestoId: number;
  puesto?: { nombre: string };
}

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [puestos, setPuestos] = useState<{ id: number; nombre: string }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Empleado>({
    nombre: '',
    telefono: '',
    cargo: '',
    salario: 0,
    puestoId: 0,
  });

  const isEditing = !!form.id;

  const loadData = async () => {
    const empleadosRes = await api.get('/empleados');
    const puestosRes = await api.get('/puestos');
    setEmpleados(empleadosRes.data);
    setPuestos(puestosRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handler exclusivo para inputs tipo text y number
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'salario' ? Number(value) : value,
    }));
  };

  // Handler exclusivo para selects
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const resetForm = () => {
    setForm({ nombre: '', telefono: '', cargo: '', salario: 0, puestoId: 0 });
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const empleadoData = cleanData(form, ['nombre', 'telefono', 'cargo', 'salario', 'puestoId']);
    try {
      if (isEditing) {
        await api.put(`/empleados/${form.id}`, empleadoData);
      } else {
        await api.post('/empleados', empleadoData);
      }
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error al guardar empleado', error);
    }
  };

  const handleEdit = (empleado: Empleado) => {
    setForm(empleado);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      await api.delete(`/empleados/${id}`);
      await loadData();
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2><i className="bi-person-badge"></i> Empleados</h2>
        <Button onClick={() => setShowModal(true)}>Agregar Empleado</Button>
      </div>

      <Table striped bordered hover className="table table-striped table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Teléfono</th>
            <th>Salario</th>
            <th>Puesto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nombre}</td>
              <td>{e.cargo}</td>
              <td>{e.telefono}</td>
              <td>Q{e.salario}</td>
              <td>{e.puesto?.nombre}</td>
              <td>
                <Button size="sm" variant="success" onClick={() => handleEdit(e)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(e.id!)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {['nombre', 'telefono', 'cargo', 'salario'].map((field) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                name={field}
                type={field === 'salario' ? 'number' : 'text'}
                value={(form as any)[field]}
                onChange={handleInputChange}
              />
            </Form.Group>
          ))}
          <Form.Group className="mb-3">
            <Form.Label>Puesto</Form.Label>
            <Form.Select name="puestoId" value={form.puestoId} onChange={handleSelectChange}>
              <option value="">Seleccione un puesto</option>
              {puestos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
