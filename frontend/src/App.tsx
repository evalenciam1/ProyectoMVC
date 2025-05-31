import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navbar'; // importa tu Navbar
import Clientes from './pages/Clientes';
import Vehiculos from './pages/Vehiculos';
import Ordenes from './pages/Ordenes';
import DetalleOrdenes from './pages/DetalleOrdenes';
import Empleados from './pages/Empleados';
import Puestos from './pages/Puestos';
import RepuestosOrden from './pages/OrdenRepuestos';
import Facturas from './pages/factura';
import DetalleFacturas from './pages/DetalleFactura';
import Informes from './pages/informes';

function App() {

  return (
    <Router>
    <Navigation />
    <div className="">
      <Routes>
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/puestos" element={<Puestos />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/ordenes" element={<Ordenes />} />
        <Route path='/detalles' element={<DetalleOrdenes />} />
        <Route path='/repuestos/:ordenId' element={<RepuestosOrden />} />
        <Route path="/detalles/:ordenId" element={<DetalleOrdenes />}/>{/* ✅ aquí */}
        <Route path='/facturas' element={<Facturas />} />
        <Route path="/detalles-factura/:facturaId" element={<DetalleFacturas />} />
        <Route path='/informes' element={<Informes />} />
      </Routes>
    </div>
  </Router>
  )
}

export default App