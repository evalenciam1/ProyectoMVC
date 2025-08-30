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
          Ferreteria
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-3">
            <Nav.Link as={Link} to="/clientes" className="nav-link-custom">Clientes</Nav.Link>
            <Nav.Link as={Link} to="/empleados" className="nav-link-custom">Ventas</Nav.Link>
            <Nav.Link as={Link} to="/puestos" className="nav-link-custom">Inventario</Nav.Link>
            <Nav.Link as={Link} to="/vehiculos" className="nav-link-custom">Proveedores</Nav.Link>
            <Nav.Link as={Link} to="/informes" className="nav-link-custom">Informes</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
