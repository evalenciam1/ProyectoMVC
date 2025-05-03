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
import Empleados from './pages/Empleado';
import Puestos from './pages/Puesto';

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
        <Route path="/detalles/:ordenId" element={<DetalleOrdenes />}/>
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/puestos" element={<Puestos />} />
      </Routes>
    </div>
  </Router>
  )
}

export default App