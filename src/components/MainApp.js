import React, { useState, useEffect } from 'react';
import Header from './Header';
import GestionUsuarios from './sections/GestionUsuarios';
import { actualizarContadorCarrito } from '../utils/carritoUtils';
import Content from './Content';
import Notificaciones from './Notificaciones';
import AdBanner from './AdBanner'; 

const MainApp = ({ onLogout }) => {
  const [currentSection, setCurrentSection] = useState('inicio');
  const [carritoCount, setCarritoCount] = useState(0);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [mostrarAnuncios, setMostrarAnuncios] = useState(false);

  useEffect(() => {
    // Obtener usuario actual
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    setUsuarioActual(usuario);
    
    // Solo mostrar anuncios si hay un usuario logueado
    setMostrarAnuncios(!!usuario);
    
    // Actualizar contador del carrito
    actualizarContadorCarrito(setCarritoCount);

    // Inicializar anuncios si no existen
    if (!localStorage.getItem("anuncios")) {
      const anunciosIniciales = [
        { id: 1, texto: "🔥 Oferta Especial: 50% de descuento", tipo: "sidebar" },
        { id: 2, texto: "🚚 Envío gratis en compras > $300", tipo: "square" },
        { id: 3, texto: "⭐ Nuevos productos en stock", tipo: "banner" },
        { id: 4, texto: "📱 App móvil disponible", tipo: "square" }
      ];
      localStorage.setItem("anuncios", JSON.stringify(anunciosIniciales));
    }
  }, []);

  const handleUpdateCarrito = () => {
    actualizarContadorCarrito(setCarritoCount);
  };

  const handleChangeSection = (section) => {
    setCurrentSection(section);
  };

  // Obtener anuncios
  const getAnuncios = () => {
    return JSON.parse(localStorage.getItem("anuncios")) || [];
  };

  // Si la sección actual es "gestion-usuarios", mostrar ese componente
  if (currentSection === 'gestion-usuarios') {
    return <GestionUsuarios onBack={() => setCurrentSection('inicio')} />;
  }

  return (
    <div className="main-app-with-ads">
      {/* Componente de Notificaciones - se muestra en todas las secciones */}
      <Notificaciones />
      
      <Header 
        usuarioActual={usuarioActual}
        carritoCount={carritoCount}
        onLogout={onLogout}
        onChangeSection={handleChangeSection}
      />
      
      <div className="app-layout">
        {/* Sidebar izquierdo con anuncios - SOLO SI mostrarAnuncios ES true */}
        {mostrarAnuncios && (
          <aside className="left-sidebar-ads">
            <AdBanner 
              size="sidebar" 
              content={getAnuncios()[0]?.texto}
            />
            <AdBanner 
              size="square" 
              content={getAnuncios()[1]?.texto}
            />
            <AdBanner 
              size="square" 
              content="💳 Aceptamos todas las tarjetas"
            />
          </aside>
        )}

        {/* Contenido principal */}
        <main className={`main-content-with-ads ${!mostrarAnuncios ? 'full-width' : ''}`}>
          {/* ✅ SOLO EL CONTENIDO SIN BANNER ARRIBA ✅ */}
          <Content 
            currentSection={currentSection}
            onChangeSection={handleChangeSection}
            onUpdateCarrito={handleUpdateCarrito}
          />

          {/* Anuncio banner inferior - SOLO SI mostrarAnuncios ES true */}
          {mostrarAnuncios && (
            <AdBanner 
              size="banner" 
              content="🎉 ¡Clientes satisfechos! ⭐⭐⭐⭐⭐"
            />
          )}
        </main>

        {/* Sidebar derecho con anuncios - SOLO SI mostrarAnuncios ES true */}
        {mostrarAnuncios && (
          <aside className="right-sidebar-ads">
            <AdBanner 
              size="square" 
              content={getAnuncios()[3]?.texto}
            />
            <AdBanner 
              size="sidebar" 
              content="📞 Soporte técnico 24/7"
            />
            <AdBanner 
              size="square" 
              content="🛡️ Compra 100% segura"
            />
          </aside>
        )}
      </div>
    </div>
  );
};

export default MainApp;