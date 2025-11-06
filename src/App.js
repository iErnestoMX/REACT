import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Recuperar from './components/Recuperar';
import MainApp from './components/MainApp';
import Notificaciones from './components/Notificaciones';
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

  switch (currentView) {
    case 'registro':
      return <Registro onBackToLogin={() => setCurrentView('login')} />;
    case 'recuperar':
      return <Recuperar onBackToLogin={() => setCurrentView('login')} />;
    default:
      return (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onShowRegistro={() => setCurrentView('registro')} 
          onShowRecuperar={() => setCurrentView('recuperar')} 
        />
      );
  }
}

export default App;