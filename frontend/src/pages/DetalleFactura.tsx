import { useEffect, useState, ChangeEvent } from 'react';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { cleanData } from '../utils/cleanData';

interface DetalleFactura {
  id?: number;
  facturaId: number;
  pagoId?: number;
  ordenId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Factura {
  id: number;
  fechaEmision: string;
  total: number;
}

interface OrdenTrabajo {
  id: number;
  descripcion: string;
}

export default function DetalleFacturaPage() {
  const [detalles, setDetalles] = useState<DetalleFactura[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<DetalleFactura>({
    facturaId: 0,
    ordenId: 0,
    cantidad: 1,
    precioUnitario: 0,
    subtotal: 0,
    pagoId: undefined,
  });

  const isEditing = !!form.id;

  const loadData = async () => {
    try {
      const [detResp, factResp, ordenResp] = await Promise.all([
        api.get('/detalle-factura'),
        api.get('/facturas'),
        api.get('/ordenes-trabajo'),
      ]);

      setDetalles(detResp.data);
      setFacturas(factResp.data);
      setOrdenes(ordenResp.data);
    } catch (error) {
      console.error('Error al cargar datos', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e: ChangeEvent<any>) => {
    const { name, value } = e.target;
    const numericFields = ['cantidad', 'precioUnitario', 'facturaId', 'ordenId'];
    const parsed = numericFields.includes(name) ? parseFloat(value) || 0 : value;

    setForm((prev) => {
      const updated = { ...prev, [name]: parsed };
      updated.subtotal = (updated.cantidad || 0) * (updated.precioUnitario || 0);
      return updated;
    });
  };

  const resetForm = () => {
    setForm({
      facturaId: 0,
      ordenId: 0,
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0,
      pagoId: undefined,
    });
    setShowModal(false);
  };

  const actualizarTotalFactura = async (facturaId: number) => {
    try {
      const { data: detallesFactura } = await api.get(`/detalle-factura/factura/${facturaId}`);
      const nuevoTotal = detallesFactura.reduce((sum: number, det: DetalleFactura) => sum + det.subtotal, 0);
      await api.put(`/facturas/${facturaId}`, { total: nuevoTotal });
  
      // ⚠️ Llamar a recargar facturas si tienes acceso a esa función
      // Si estás en el componente padre (FacturaPage), refresca el listado desde allí
  
    } catch (error) {
      console.error('Error al actualizar el total de la factura', error);
    }
  };

  const handleSubmit = async () => {
    if (!form.facturaId || form.facturaId === 0) {
      alert('Por favor selecciona una Factura válida.');
      return;
    }
    if (!form.ordenId || form.ordenId === 0) {
      alert('Por favor selecciona una Orden de Trabajo válida.');
      return;
    }

    const dto = cleanData(form, [
      'facturaId',
      'ordenId',
      'pagoId',
      'cantidad',
      'precioUnitario',
      'subtotal',
    ]);

    try {
      if (isEditing) {
        await api.put(`/detalle-factura/${form.id}`, dto);
      } else {
        await api.post('/detalle-factura', dto);
      }
      await actualizarTotalFactura(form.facturaId);
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error al guardar detalle de factura', error);
    }
  };

  const handleEdit = (detalle: DetalleFactura) => {
    setForm(detalle);
    setShowModal(true);
  };

  const handleDelete = async (id: number, facturaId: number) => {
    if (confirm('¿Eliminar este detalle?')) {
      await api.delete(`/detalle-factura/${id}`);
      await actualizarTotalFactura(facturaId);
      await loadData();
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0"><i className="bi bi-card-list"></i> Detalles de Factura</h2>
        {facturas.length > 0 ? (
          <Button onClick={() => setShowModal(true)}>Agregar Detalle</Button>
        ) : (
          <p className="text-muted">Primero debes crear al menos una factura.</p>
        )}
      </div>

      <Table striped bordered hover className="table table-striped table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Factura</th>
            <th>Orden</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.facturaId}</td>
              <td>{d.ordenId}</td>
              <td>{d.cantidad}</td>
              <td>Q{Number(d.precioUnitario || 0).toFixed(2)}</td>
              <td>Q{Number(d.subtotal || 0).toFixed(2)}</td>
              <td>
                <Button size="sm" variant="success" onClick={() => handleEdit(d)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(d.id!, d.facturaId)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Detalle' : 'Nuevo Detalle de Factura'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Factura</Form.Label>
              <Form.Select
                name="facturaId"
                value={form.facturaId.toString()}
                onChange={handleChange}
              >
                <option value="">Selecciona una factura</option>
                {facturas.map(f => (
                  <option key={f.id} value={f.id}>#{f.id} - {f.fechaEmision?.split('T')[0]}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Orden de Trabajo</Form.Label>
              <Form.Select
                name="ordenId"
                value={form.ordenId.toString()}
                onChange={handleChange}
              >
                <option value="">Selecciona una orden</option>
                {ordenes.map(o => (
                  <option key={o.id} value={o.id}>#{o.id} - {o.descripcion}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                min={1}
                value={form.cantidad.toString()}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio Unitario (Q)</Form.Label>
              <Form.Control
                type="number"
                name="precioUnitario"
                step="0.01"
                value={form.precioUnitario.toString()}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subtotal (automático)</Form.Label>
              <Form.Control
                type="number"
                name="subtotal"
                readOnly
                value={form.subtotal.toString()}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
