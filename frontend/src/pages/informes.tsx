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

    //Cargamos vehiculos
    const loadVehiculos = async () => {
        const res = await api.get('/vehiculos');
        setVehiculos(res.data);
    };
    const loadOrdenes = async () => {
        const { data } = await api.get('/ordenes-trabajo');
        setOrdenes(data);
    };
    useEffect(() => {
        loadVehiculos();
        loadOrdenes();

    }, []);



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
            </div>
        </div>
    );
}

