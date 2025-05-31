// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Navbar.css';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-title">🔧 Taller Automotriz</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
            <Nav.Link as={Link} to="/empleados">Empleados</Nav.Link>
            <Nav.Link as={Link} to="/puestos">Puestos</Nav.Link>
            <Nav.Link as={Link} to="/vehiculos">Vehículos</Nav.Link>
            <Nav.Link as={Link} to="/ordenes">Órdenes</Nav.Link>
            <Nav.Link as={Link} to="/facturas">Facturas</Nav.Link>
            <Nav.Link as={Link} to="/informes">Informes</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;