import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Recuperar from './components/Recuperar';
import MainApp from './components/MainApp';
import Notificaciones from './components/Notificaciones';
import AdBanner from './components/AdBanner'; // Nuevo componente
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    // Inicializar datos
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
      { username: "LMKS", password: "1234", tipo: "admin" },
      { username: "Angel", password: "1234", tipo: "comprador" }
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Inicializar inventario si no existe
    if (!localStorage.getItem("inventario")) {
      localStorage.setItem("inventario", JSON.stringify([]));
    }

    // Inicializar proveedores si no existe
    if (!localStorage.getItem("proveedores")) {
      localStorage.setItem("proveedores", JSON.stringify([]));
    }

    // Inicializar anuncios si no existen
    if (!localStorage.getItem("anuncios")) {
      const anunciosIniciales = [
        { id: 1, texto: "¡Oferta Especial! 50% descuento", tipo: "banner" },
        { id: 2, texto: "Nueva App Móvil Disponible", tipo: "sidebar" },
        { id: 3, texto: "Envío Gratis en compras mayores a $500", tipo: "square" }
      ];
      localStorage.setItem("anuncios", JSON.stringify(anunciosIniciales));
    }

    // Verificar si ya está loggeado
    if (localStorage.getItem("loggedIn")) {
      setLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
    setCurrentView('login');
  };

  // Obtener anuncios
  const getAnuncios = () => {
    return JSON.parse(localStorage.getItem("anuncios")) || [];
  };

  if (loggedIn) {
    return <MainApp onLogout={handleLogout} />;
  }

  // Componente para páginas de autenticación con anuncios
  const AuthWithAds = ({ children }) => (
    <div className="auth-container">
      <div className="auth-content">
        {children}
      </div>
      <div className="auth-ads">
        <AdBanner 
          size="square" 
          content={getAnuncios()[0]?.texto || "¡Bienvenido!"}
        />
        <AdBanner 
          size="sidebar" 
          content={getAnuncios()[1]?.texto || "Descubre nuestras ofertas"}
        />
      </div>
    </div>
  );

  switch (currentView) {
    case 'registro':
      return (
        <AuthWithAds>
          <Registro onBackToLogin={() => setCurrentView('login')} />
        </AuthWithAds>
      );
    case 'recuperar':
      return (
        <AuthWithAds>
          <Recuperar onBackToLogin={() => setCurrentView('login')} />
        </AuthWithAds>
      );
    default:
      return (
        <AuthWithAds>
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onShowRegistro={() => setCurrentView('registro')} 
            onShowRecuperar={() => setCurrentView('recuperar')} 
          />
        </AuthWithAds>
      );
  }
}

export default App;