// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Navbar.css';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar navbar-dark bg-dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Taller Automotriz</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar navbar-dark bg-dark">
            <Nav.Link as={Link} to="/clientes" className="nav-link">Clientes</Nav.Link>
            <Nav.Link as={Link} to="/empleados">Empleados</Nav.Link>
            <Nav.Link as={Link} to="/puestos">Puestos</Nav.Link>
            <Nav.Link as={Link} to="/vehiculos">Vehículos</Nav.Link>
            <Nav.Link as={Link} to="/ordenes">Órdenes de Trabajo</Nav.Link>
            <Nav.Link as={Link} to="/facturas">Facturas</Nav.Link>
            <Nav.Link as={Link} to="/reporteria">Reportería</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
