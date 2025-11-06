import React, { useState, useEffect } from 'react';
import Header from './Header';
import GestionUsuarios from './sections/GestionUsuarios';
import { actualizarContadorCarrito } from '../utils/carritoUtils';
import Content from './Content';
import Notificaciones from './Notificaciones'; // Importar el componente de notificaciones

const MainApp = ({ onLogout }) => {
  const [currentSection, setCurrentSection] = useState('inicio');
  const [carritoCount, setCarritoCount] = useState(0);
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    // Obtener usuario actual
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    setUsuarioActual(usuario);
    
    // Actualizar contador del carrito
    actualizarContadorCarrito(setCarritoCount);

    // Aplicar modo oscuro si está guardado
    const modo = localStorage.getItem("modo");
    if (modo === "oscuro") {
      document.body.classList.add("modo-oscuro");
    }
  }, []);

  const handleUpdateCarrito = () => {
    actualizarContadorCarrito(setCarritoCount);
  };

  const handleChangeSection = (section) => {
    setCurrentSection(section);
  };

  // Si la sección actual es "gestion-usuarios", mostrar ese componente
  if (currentSection === 'gestion-usuarios') {
    return <GestionUsuarios onBack={() => setCurrentSection('inicio')} />;
  }

  return (
    <div>
      {/* Componente de Notificaciones - se muestra en todas las secciones */}
      <Notificaciones />
      
      <Header 
        usuarioActual={usuarioActual}
        carritoCount={carritoCount}
        onLogout={onLogout}
        onChangeSection={handleChangeSection}
      />
      <Content 
        currentSection={currentSection}
        onChangeSection={handleChangeSection}
        onUpdateCarrito={handleUpdateCarrito}
      />
    </div>
  );
};

export default MainApp;