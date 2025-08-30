// src/components/Home.tsx
import tallerImg from '../assets/taller.jpg'; // ✅ Importa la imagen como módulo

const Home = () => {
  return (
    <div>
      <h1>Ferreteria</h1>
      <img src={tallerImg} alt="Ferreteria" style={{ width: '100%', maxWidth: '800px', borderRadius: '12px' }} />
    </div>
  );
};

export default Home;

