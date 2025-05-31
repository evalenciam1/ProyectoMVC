// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Navbar.css';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 d-flex align-items-center">
          <span role="img" aria-label="wrench" className="me-2">🔧</span>
          Taller Automotriz
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-3">
            <Nav.Link as={Link} to="/clientes" className="nav-link-custom">Clientes</Nav.Link>
            <Nav.Link as={Link} to="/empleados" className="nav-link-custom">Empleados</Nav.Link>
            <Nav.Link as={Link} to="/puestos" className="nav-link-custom">Puestos</Nav.Link>
            <Nav.Link as={Link} to="/vehiculos" className="nav-link-custom">Vehículos</Nav.Link>
            <Nav.Link as={Link} to="/ordenes" className="nav-link-custom">Órdenes</Nav.Link>
            <Nav.Link as={Link} to="/facturas" className="nav-link-custom">Facturas</Nav.Link>
            <Nav.Link as={Link} to="/informes" className="nav-link-custom">Informes</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
