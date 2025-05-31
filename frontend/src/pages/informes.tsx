/* eslint-disable no-irregular-whitespace */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { Button, Modal, Table, Form, Col, Row } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Vehiculos from './Vehiculos';
import DetalleFactura from './DetalleFactura';
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

export default function informes() {
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [detalleFacturas, setDetalles] = useState<DetalleFactura[]>([]);
    const [factura, setFactura] = useState<Factura | null>(null);
    const [servicios, setServicios] = useState<Servicios[]>([]);
    const [repuestos, setRepuestos] = useState<Repuestos[]>([]);
    const [fechaInicio, setFechaInicio] = useState<string>('');
    const [fechaFin, setFechaFin] = useState<string>('');

    //Cargamos Fechas
    const filtrarOrdenesPorFechas = () => {
        const ordenesFiltradas = ordenes.filter((orden) => {
            const fechaOrden = new Date(orden.fecha ?? '').toISOString().split('T')[0];
            return (!fechaInicio || fechaOrden >= fechaInicio) &&
                (!fechaFin || fechaOrden <= fechaFin);
        });
        setOrdenes(ordenesFiltradas);
    };

    //Cargamos vehiculos
    const loadVehiculos = async () => {
        const res = await api.get('/vehiculos');
        setVehiculos(res.data);
    };
    //Cargamos Ordenes
    const loadOrdenes = async () => {
        const { data } = await api.get('/ordenes-trabajo');
        setOrdenes(data);
    };

    //Carga de servicios realizados
    const loadServicios = async () => {
        const res = await api.get('/detalles-orden');
        setServicios(res.data);
    };

    //Carga de Repuestos utilizados
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

    //Generacion de PDF de Ordenes por Vehiculo
    const generarPDFOrdenesVehiculo = () => {
        if (!ordenes) return;

        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text(`Ordenes por Vehiculo`, 14, 15);
        pdf.setFontSize(12);
        pdf.text('Este es el detalle de Ordenes por Vehiculo', 14, 30);




        autoTable(pdf, {
            startY: 50,
            head: [['ID', 'Fecha', 'Placa', 'Marca', 'Descripcion', 'Estado']],
            body: ordenes.map((d) => [
                d.id,
                new Date(d.fecha).toLocaleDateString('es-ES'),
                d.vehiculo?.placa,
                d.vehiculo?.marca,
                d.descripcion,
                d.estado,
            ]),
        });

        pdf.save(`Ordenes por Vehiculo.pdf`);
    };

    //Generacion de PDF de Ordenes
    const generarPDFOrdenes = () => {
        if (!ordenes) return;

        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text(`Ordenes`, 14, 15);
        pdf.setFontSize(12);
        pdf.text('Este es el detalle de ordenes abiertas', 14, 30);




        autoTable(pdf, {
            startY: 50,
            head: [['ID', 'Fecha', 'Placa', 'Marca', 'Descripcion', 'Estado']],
            body: ordenes.map((d) => [
                d.id,
                new Date(d.fecha).toLocaleDateString('es-ES'),
                d.vehiculo?.placa,
                d.vehiculo?.marca,
                d.descripcion,
                d.estado,
            ]),
        });

        pdf.save(`Ordenes.pdf`);
    };

    //Generacion de PDF de Servicios
    const generarPDFServicios = () => {
        if (!servicios) return;

        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text(`Servicios realizados`, 14, 15);
        pdf.setFontSize(12);
        pdf.text('Este es el detalle de Servicios realizados', 14, 30);




        autoTable(pdf, {
            startY: 50,
            head: [['ID', 'Empleado', 'Descripcion', 'Precio Unitario', 'Cantidad', 'Costo']],
            body: servicios.map((s) => [
                s.id,
                s.empleado?.nombre,
                s.descripcion,
                s.precioUnitario,
                s.cantidad,
                s.costoUnitario
            ]),
        });

        pdf.save(`Servicios.pdf`);
    };

    //Generacion de PDF de Repuestos
    const generarPDFRepuestos = () => {
        if (!repuestos) return;

        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text(`Repuestos utilizados`, 14, 15);
        pdf.setFontSize(12);
        pdf.text('Este es el detalle de repuestos utilizados', 14, 30);




        autoTable(pdf, {
            startY: 50,
            head: [['ID', 'Id Orden', 'Descripcion', 'Cantidad', 'Precio Unitario', 'Costo Unitario']],
            body: repuestos.map((r) => [
                r.id,
                r.ordenId,
                r.descripcion,
                r.cantidad,
                r.precioUnitario,
                r.costoUnitario
            ]),
        });

        pdf.save(`Servicios.pdf`);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2><i className="bi bi-receipt"></i> Generacion de informes</h2>
            </div>
            <div>
                <h3>Informes de vehiculos</h3>
                <Form>
                    <Form.Group>
                        <Form.Label>Vehículo</Form.Label>
                        <Form.Select name="vehiculoId">
                            <option value="">Seleccione un vehículo</option>
                            {vehiculos.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.placa} - {v.marca} {v.modelo}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>

                <h3>Informes de Utilización</h3>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Desde</Form.Label>
                        <Form.Control type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                    </Col>
                    <Col>
                        <Form.Label>Hasta</Form.Label>
                        <Form.Control type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                    </Col>
                    <Col className="d-flex align-items-end">
                        <Button variant="primary" onClick={filtrarOrdenesPorFechas}>
                            Filtrar por Fechas
                        </Button>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Button variant="warning" onClick={generarPDFOrdenesVehiculo} className="w-100">
                            Generar PDF de Orden por Vehículos
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="warning" onClick={generarPDFOrdenes} className="w-100">
                            Generar PDF de Orden por Fechas
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Button variant="warning" onClick={generarPDFServicios} className="w-100">
                            Generar PDF de Servicios
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="warning" onClick={generarPDFRepuestos} className="w-100">
                            Generar PDF de Repuestos
                        </Button>
                    </Col>
                </Row>
            </div>

        </div>

    );

}