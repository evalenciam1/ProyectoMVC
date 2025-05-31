// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import './Bienvenida.css';

const Home = () => {
  const navigate = useNavigate();

  const ingresar = () => {
    navigate('/clientes');
  };

  return (
    <div className="welcome-background d-flex align-items-center justify-content-center text-center">
      <Container className="p-5 bg-light rounded-4 shadow welcome-content">
        <img
          src="/src/images.png"
          alt="Logo Taller"
          className="mb-4"
          style={{ width: '120px', height: 'auto' }}
        />
        <h1 className="fw-bold text-dark mb-3">Bienvenido al Sistema del Taller Automotriz</h1>
        <p className="text-muted mb-4">
          Administra clientes, vehículos, empleados, órdenes y mucho más desde un solo lugar.
        </p>
        <Button variant="warning" className="px-4 py-2 fw-bold" onClick={ingresar}>
          Ingresar al Sistema
        </Button>
      </Container>
    </div>
  );
};

export default Home;
