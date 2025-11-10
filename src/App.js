import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Recuperar from './components/Recuperar';
import MainApp from './components/MainApp';
import './App.css';

// Función segura para localStorage que funciona con SSR
const getLocalStorage = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Inicializar datos solo en el cliente
    initializeData();
    checkLoggedInStatus();
    setIsInitialized(true);
  }, []);

  const initializeData = () => {
    // Usuarios por defecto
    const usuariosExistentes = getLocalStorage("usuarios", []);
    if (usuariosExistentes.length === 0) {
      const usuariosPorDefecto = [
        { username: "LMKS", password: "1234", tipo: "admin" },
        { username: "Angel", password: "1234", tipo: "comprador" }
      ];
      setLocalStorage("usuarios", usuariosPorDefecto);
    }

    // Inventario vacío si no existe
    if (!getLocalStorage("inventario", null)) {
      setLocalStorage("inventario", []);
    }

    // Proveedores vacíos si no existen
    if (!getLocalStorage("proveedores", null)) {
      setLocalStorage("proveedores", []);
    }

    // Anuncios por defecto
    if (!getLocalStorage("anuncios", null)) {
      const anunciosIniciales = [
        { id: 1, texto: "¡Oferta Especial! 50% descuento", tipo: "banner" },
        { id: 2, texto: "Nueva App Móvil Disponible", tipo: "sidebar" },
        { id: 3, texto: "Envío Gratis en compras mayores a $500", tipo: "square" }
      ];
      setLocalStorage("anuncios", anunciosIniciales);
    }

    // Ventas vacías si no existen
    if (!getLocalStorage("ventas", null)) {
      setLocalStorage("ventas", []);
    }

    // Clientes vacíos si no existen
    if (!getLocalStorage("clientes", null)) {
      setLocalStorage("clientes", []);
    }
  };

  const checkLoggedInStatus = () => {
    const loggedInStatus = getLocalStorage("loggedIn", false);
    if (loggedInStatus) {
      setLoggedIn(true);
    }
  };

  const handleLoginSuccess = () => {
    setLocalStorage("loggedIn", true);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLocalStorage("loggedIn", false);
    setLoggedIn(false);
    setCurrentView('login');
  };

  // Evitar renderizado hasta que se inicialice en el cliente
  if (!isInitialized) {
    return (
      <div className="auth-container">
        <div className="auth-content">
          <div>Cargando...</div>
        </div>
      </div>
    );
  }

  if (loggedIn) {
    return <MainApp onLogout={handleLogout} />;
  }

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