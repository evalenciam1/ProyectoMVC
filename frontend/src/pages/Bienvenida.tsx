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
          src="/src/images1.png"
          alt="Logo Taller"
          className="mb-4"
          style={{ width: '280px', height: 'auto' }}
        />
        <h1 className="fw-bold text-dark mb-3">Bienvenido al Sistema de Ferreteria</h1>
        <p className="text-muted mb-4">
          Administracion y control de materiales de ferreteria.
        </p>
        <Button variant="warning" className="px-4 py-2 fw-bold" onClick={ingresar}>
          Ingresar al Sistema
        </Button>
      </Container>
    </div>
  );
};

export default Home;
