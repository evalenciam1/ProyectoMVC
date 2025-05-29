import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Vehiculos from './Vehiculos';

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
    empleadoId?: number;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    costoUnitario: number;
    empleado: { nombre: string } | null;
    ordenTrabajo: { estado: string, descripcion: string } | null;
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
    const [totalServicios, setTotalServicios] = useState(0);
    const [repuestos, setRepuestos] = useState<Repuestos[]>([]);

    //Cargamos vehiculos
    const loadVehiculos = async () => {
        const res = await api.get('/vehiculos');
        setVehiculos(res.data);
    };
    const loadOrdenes = async () => {
        const { data } = await api.get('/ordenes-trabajo');
        setOrdenes(data);
    };

    //Carga de servicios realizados
    const loadServicios = async () => {
        const { data } = await api.get(`/detalles-orden`);
        setServicios(data);
        const total = data.reduce((sum: number, item: any) => sum + Number(item.costoUnitario), 0);
        setTotalServicios(total); // Guarda el total si quieres mostrarlo
    };

    //Carga de repuestos utilizados totales
    const loadRepuestos = async () => {
        const { data } = await api.get(`/repuestos`);
        setRepuestos(data);
    };

    useEffect(() => {
        loadVehiculos();
        loadOrdenes();
        loadServicios();
        loadRepuestos();

    }, []);

    //Generacion de PDF de Servicios
    const generarPDFServicios = () => {
        if (!servicios) return;

        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text(`Servicios realizados`, 14, 15);
        pdf.setFontSize(12);
        pdf.text('Este es el detalle de servicios realizados', 14, 30);


        autoTable(pdf, {
            startY: 50,
            head: [['ID', 'Empleado', 'Descripcion', 'Precio Unitario', 'Cantidad', 'Costo']],
            body: servicios.map((s) => [
                s.id,
                s.empleado?.nombre,
                s.descripcion,
                s.precioUnitario,
                s.cantidad,
                s.costoUnitario,
            ]), 
        });

        pdf.save(`servicios.pdf`);
    };

    //Generacion de PDF de repuestos
    const generarPDFRepuestos = () => {
        if (!repuestos) return;

        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text(`Repuestos utilizados`, 14, 15);
        pdf.setFontSize(12);
        pdf.text('Este es el detalle de repuestos utilizados', 14, 30);


        autoTable(pdf, {
            startY: 50,
            head: [['ID', 'Id Orden', 'Descripcion', 'Precio Unitario', 'Cantidad', 'Costo']],
            body: repuestos.map((r) => [
                r.id,
                r.ordenId,
                r.descripcion,
                r.precioUnitario,
                r.cantidad,
                r.costoUnitario,
            ]),

        });

        pdf.save(`repuestos.pdf`);
    };


    return (
        <div className="card">
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
                <h3>Informe de ordenes</h3>
                <Form>
                    <Form.Group>
                        <Form.Label>Ordenes</Form.Label>
                        <Form.Select name="vehiculoId" value={vehiculos.id}>
                            <option value="">Seleccione un vehículo</option>
                            {ordenes.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.id}-{o.descripcion}-{o.estado}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
                <div className='card'>
                    <h3>Informes de utilizacion</h3>

                    <Button variant="warning" onClick={generarPDFServicios}>
                        Generar PDF de Servicios
                    </Button>
                    <Button variant="warning" onClick={generarPDFRepuestos}>
                        Generar PDF de Repuestos
                    </Button>
                </div>
            </div>
        </div>
    );
}

