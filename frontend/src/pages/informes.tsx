/* eslint-disable no-irregular-whitespace */
import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Button, Form, Col, Row, Table } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DetalleFactura {
    id: number;
    facturaId: number;
    ordenId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    descripcion?: string;
}

interface Factura {
    id: number;
    fechaEmision: string;
    descuento: number | string;
    estado: string;
    total: number | string;
    ordenes?: {
        vehiculo?: {
            placa: string;
            descripcion: string;
            cliente?: {
                nombre: string;
            };
        };
    }[];
}

interface Orden {
    id?: number;
    fecha?: Date;
    vehiculoId: number;
    estado: string;
    descripcion: string;
    vehiculo?: {
        placa: string;
        marca: string;
        modelo: string;
    };
}

interface Servicios {
    id?: number;
    ordenTrabajoId: number;
    empleadoId: number;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    costoUnitario: number;
    empleado: { nombre: string } | null;
    ordenTrabajo?: { estado: string, descripcion: string } | null;
}

interface Repuestos {
    id?: number;
    ordenId: number;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    costoUnitario: number;
}

interface Vehiculo {
    id?: number;
    placa: string;
    marca: string;
    modelo: string;
    anio: number;
    clienteId: number;
    color: string;
}

export default function Informes() {
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [servicios, setServicios] = useState<Servicios[]>([]);
    const [repuestos, setRepuestos] = useState<Repuestos[]>([]);
    const [fechaInicio, setFechaInicio] = useState<string>('');
    const [fechaFin, setFechaFin] = useState<string>('');
    const [vehiculoId, setVehiculoId] = useState<string>('');
    const [reporteData, setReporteData] = useState<any[]>([]);
    const [reporteTitulo, setReporteTitulo] = useState<string>('');

    const loadVehiculos = async () => {
        const res = await api.get('/vehiculos');
        setVehiculos(res.data);
    };

    const loadOrdenes = async () => {
        const { data } = await api.get('/ordenes-trabajo');
        setOrdenes(data);
    };

    const loadServicios = async () => {
        const res = await api.get('/detalles-orden');
        setServicios(res.data);
    };

    const loadRepuestos = async () => {
        const res = await api.get('/repuestos');
        setRepuestos(res.data);
    };

    useEffect(() => {
        loadVehiculos();
        loadOrdenes();
        loadServicios();
        loadRepuestos();
    }, []);

    const filtrarOrdenes = () => {
        return ordenes.filter((orden) => {
            const fechaOrden = new Date(orden.fecha ?? '').toISOString().split('T')[0];
            return (!fechaInicio || fechaOrden >= fechaInicio) &&
                (!fechaFin || fechaOrden <= fechaFin) &&
                (!vehiculoId || orden.vehiculoId.toString() === vehiculoId);
        });
    };

    const mostrarReporte = (titulo: string, columnas: string[], filas: any[][]) => {
        setReporteTitulo(titulo);
        setReporteData([columnas, ...filas]);
    };

    const generarSumaFacturacion = async () => {
        const res = await api.get('/facturas');
        const facturas: Factura[] = res.data;

        const totales: { [estado: string]: number } = {};
        facturas.forEach(f => {
            const estado = f.estado || 'Desconocido';
            const total = typeof f.total === 'string' ? parseFloat(f.total) : f.total;
            totales[estado] = (totales[estado] || 0) + total;
        });

        const filas = Object.entries(totales).map(([estado, total]) => [estado, total.toFixed(2)]);
        mostrarReporte('Suma de Facturación por Estado', ['Estado', 'Total Facturado'], filas);
    };

    const generarVehiculosFrecuentes = () => {
        const conteo: { [placa: string]: number } = {};
        filtrarOrdenes().forEach(o => {
            if (o.vehiculo?.placa) {
                conteo[o.vehiculo.placa] = (conteo[o.vehiculo.placa] || 0) + 1;
            }
        });
        const filas = Object.entries(conteo).map(([placa, total]) => [placa, total]);
        mostrarReporte('Vehículos Más Atendidos', ['Placa', 'Órdenes'], filas);
    };

    const generarServiciosFrecuentes = () => {
        const conteo: { [desc: string]: number } = {};
        servicios.forEach(s => {
            conteo[s.descripcion] = (conteo[s.descripcion] || 0) + s.cantidad;
        });
        const filas = Object.entries(conteo).map(([desc, total]) => [desc, total]);
        mostrarReporte('Servicios Más Solicitados', ['Servicio', 'Total'], filas);
    };

    const generarRepuestosFrecuentes = () => {
        const conteo: { [desc: string]: number } = {};
        repuestos.forEach(r => {
            conteo[r.descripcion] = (conteo[r.descripcion] || 0) + r.cantidad;
        });
        const filas = Object.entries(conteo).map(([desc, total]) => [desc, total]);
        mostrarReporte('Repuestos Más Utilizados', ['Repuesto', 'Total'], filas);
    };

    const generarFacturacionEntreFechas = () => {
        const facturas = filtrarOrdenes();
        const filas = facturas.map(f => [f.id, f.descripcion, f.estado]);
        mostrarReporte('Facturación entre Fechas', ['ID', 'Descripción', 'Estado'], filas);
    };

    const generarProductividadPorEmpleado = () => {
        const conteo: { [empleado: string]: number } = {};
        servicios.forEach(s => {
            if (s.empleado?.nombre) {
                conteo[s.empleado.nombre] = (conteo[s.empleado.nombre] || 0) + 1;
            }
        });
        const filas = Object.entries(conteo).map(([empleado, total]) => [empleado, total]);
        mostrarReporte('Productividad por Empleado', ['Empleado', 'Servicios Realizados'], filas);
    };

    const generarOrdenesPorEstado = () => {
        const conteo: { [estado: string]: number } = {};
        filtrarOrdenes().forEach(o => {
            conteo[o.estado] = (conteo[o.estado] || 0) + 1;
        });
        const filas = Object.entries(conteo).map(([estado, total]) => [estado, total]);
        mostrarReporte('Órdenes por Estado', ['Estado', 'Cantidad'], filas);
    };

    const generarOrdenesPorVehiculo = () => {
        const filas = filtrarOrdenes().map(o => [o.id, o.vehiculo?.placa, o.descripcion, o.estado]);
        mostrarReporte('Órdenes por Vehículo', ['ID', 'Placa', 'Descripción', 'Estado'], filas);
    };

    const generarPDF = () => {
        if (reporteData.length === 0) return;

        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text(reporteTitulo, 14, 20);

        autoTable(pdf, {
            startY: 30,
            head: [reporteData[0]],
            body: reporteData.slice(1),
        });

        pdf.save(`${reporteTitulo}.pdf`);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2><i className="bi bi-receipt"></i> Generación de informes</h2>
            </div>
            <div>
                <h3>Filtros por Fecha</h3>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Desde</Form.Label>
                        <Form.Control type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                    </Col>
                    <Col>
                        <Form.Label>Hasta</Form.Label>
                        <Form.Control type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                    </Col>
                    <Col>
                        <Form.Label>Vehículo</Form.Label>
                        <Form.Select value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)}>
                            <option value="">Todos</option>
                            {vehiculos.map(v => (
                                <option key={v.id} value={v.id}>{v.placa} - {v.marca} {v.modelo}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>

                <h3>Generar Reportes</h3>
                <Row className="mb-3">
                    <Col><Button onClick={generarSumaFacturacion} className="w-100" variant="info">Suma de Facturación</Button></Col>
                    <Col><Button onClick={generarVehiculosFrecuentes} className="w-100" variant="info">Vehículos Más Atendidos</Button></Col>
                    <Col><Button onClick={generarServiciosFrecuentes} className="w-100" variant="info">Servicios Más Solicitados</Button></Col>
                    <Col><Button onClick={generarRepuestosFrecuentes} className="w-100" variant="info">Repuestos Más Utilizados</Button></Col>
                </Row>
                <Row className="mb-3">
                    <Col><Button onClick={generarFacturacionEntreFechas} className="w-100" variant="warning">Facturación entre Fechas</Button></Col>
                    <Col><Button onClick={generarProductividadPorEmpleado} className="w-100" variant="warning">Productividad por Empleado</Button></Col>
                    <Col><Button onClick={generarOrdenesPorEstado} className="w-100" variant="warning">Órdenes por Estado</Button></Col>
                    <Col><Button onClick={generarOrdenesPorVehiculo} className="w-100" variant="warning">Órdenes por Vehículo</Button></Col>
                </Row>

                {reporteData.length > 0 && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center">
                            <h4>{reporteTitulo}</h4>
                            <Button onClick={generarPDF} variant="danger">Exportar PDF</Button>
                        </div>
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    {reporteData[0].map((col: string, idx: number) => (
                                        <th key={idx}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {reporteData.slice(1).map((fila, index) => (
                                    <tr key={index}>
                                        {fila.map((cell: any, idx: number) => (
                                            <td key={idx}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
