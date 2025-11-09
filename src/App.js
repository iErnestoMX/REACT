import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Recuperar from './components/Recuperar';
import MainApp from './components/MainApp';
import Notificaciones from './components/Notificaciones';
import AdBanner from './components/AdBanner';
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

  if (loggedIn) {
    return <MainApp onLogout={handleLogout} />;
  }

  // Renderizar páginas de autenticación SIN ANUNCIOS
  switch (currentView) {
    case 'registro':
      return (
        <div className="auth-container">
          <div className="auth-content">
            <Registro onBackToLogin={() => setCurrentView('login')} />
          </div>
        </div>
      );
    case 'recuperar':
      return (
        <div className="auth-container">
          <div className="auth-content">
            <Recuperar onBackToLogin={() => setCurrentView('login')} />
          </div>
        </div>
      );
    default:
      return (
        <div className="auth-container">
          <div className="auth-content">
            <Login 
              onLoginSuccess={handleLoginSuccess} 
              onShowRegistro={() => setCurrentView('registro')} 
              onShowRecuperar={() => setCurrentView('recuperar')} 
            />
          </div>
        </div>
      );
  }
}

export default App;