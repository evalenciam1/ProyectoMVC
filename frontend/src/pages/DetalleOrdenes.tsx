import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

interface Detalle {
  id?: number;
  ordenTrabajoId: number;
  empleadoId?: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  costoUnitario: number;
  empleado: { nombre: string } | null;
  ordenTrabajo: { estado: string, descripcion: string } | null;
}

interface Empleado {
  id: number;
  nombre: string;
}

export default function DetalleOrdenes() {
  const { ordenId } = useParams<{ ordenId: string }>();
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);  // Nuevo estado para empleados
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Detalle>({
    ordenTrabajoId: Number(ordenId),
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
    costoUnitario: 0,
    empleado: null,
    ordenTrabajo: null,
  });

  const loadDetalles = async () => {
    if (!ordenId) return;
    const res = await api.get(`/detalles-orden/orden/${ordenId}`);
    setDetalles(res.data);
  };

  const loadEmpleados = async () => {
    const res = await api.get('/empleados'); // Asegúrate de que esta ruta esté disponible
    setEmpleados(res.data);
  };

  useEffect(() => {
    loadDetalles();
    loadEmpleados(); // Cargar empleados al montar el componente
  }, [ordenId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['cantidad', 'precioUnitario'];
    setForm({
      ...form,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  // Calcula el costo unitario basado en la cantidad y el precio unitario
  const calcularCosto = () => {
    return form.cantidad * form.precioUnitario;
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      ordenTrabajoId: Number(ordenId),
      costoUnitario: calcularCosto(), // Calculamos costoUnitario antes de enviar al backend
    };

    if (form.id) {
      // Editar detalle existente
      await api.put(`/detalles-orden/${form.id}`, data);
    } else {
      // Crear nuevo detalle
      await api.post('/detalles-orden', data);
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
      ordenTrabajoId: Number(ordenId),
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      costoUnitario: 0,
      empleado: null,
      ordenTrabajo: null,
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0"><i className="bi bi-list-check"></i> Servicios de la Orden #{ordenId}</h2>
        <Button onClick={() => setShowModal(true)}>Agregar Servicio</Button>
      </div>

      <Table striped bordered hover className="table table-striped table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Costo Total</th>
            <th>Empleado</th>
            <th>Estado de la Orden</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.descripcion}</td>
              <td>{d.cantidad}</td>
              <td>Q{Number(d.precioUnitario).toFixed(2)}</td>
              <td>Q{Number(d.costoUnitario).toFixed(2)}</td>
              <td>{d.empleado?.nombre || 'No asignado'}</td>
              <td>{d.ordenTrabajo?.estado}</td>
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
          <Modal.Title>{form.id ? 'Editar Servicio' : 'Nuevo Servicio'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                name="cantidad"
                type="number"
                value={form.cantidad}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Precio Unitario</Form.Label>
              <Form.Control
                name="precioUnitario"
                type="number"
                value={form.precioUnitario}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Empleado</Form.Label>
              <Form.Select name="empleadoId" value={form.empleadoId} onChange={handleChange}>
                <option value={0}>Seleccione un empleado</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </Form.Select>
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
