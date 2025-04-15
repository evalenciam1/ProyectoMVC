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

function App() {

  return (
    <Router>
    <Navigation />
    <div className="">
      <Routes>
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/ordenes" element={<Ordenes />} />
        <Route path='/detalles' element={<DetalleOrdenes />} />
        <Route path="/detalles/:ordenId" element={<DetalleOrdenes />}/>{/* ✅ aquí */}
      </Routes>
    </div>
  </Router>
  )
}

export default App