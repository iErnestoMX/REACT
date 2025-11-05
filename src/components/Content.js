import React from 'react';
import Articulos from './sections/Articulos';
import Carrito from './sections/Carrito';
import Inventario from './sections/Inventario';
import Contacto from './sections/Contacto';
import Dashboard from './sections/Dashboard';
import Tarjetas from './sections/Tarjetas';
import Inicio from './sections/Inicio';
import TarjetaPresentacion from './sections/TarjetaPresentacion';
import Portafolio from './sections/Portafolio';
import Favoritos from './sections/Favoritos'; // Agregar este import

const Content = ({ currentSection, onChangeSection, onUpdateCarrito }) => {
  const renderSection = () => {
    switch (currentSection) {
      case 'articulos':
        return <Articulos onUpdateCarrito={onUpdateCarrito} />;
      case 'carrito':
        return <Carrito onUpdateCarrito={onUpdateCarrito} />;
      case 'favoritos': // Agregar este caso
        return <Favoritos onUpdateFavoritos={onUpdateCarrito} />;
      case 'inventario':
        return <Inventario />;
      case 'contacto':
        return <Contacto />;
      case 'dashboard':
        return <Dashboard />;
      case 'tarjetas':
        return <Tarjetas />;
      case 'tarjeta':
        return <TarjetaPresentacion />;
      case 'portafolio':
        return <Portafolio />;
      default:
        return <Inicio onChangeSection={onChangeSection} />;
    }
  };

  return (
    <main id="content">
      {renderSection()}
    </main>
  );
};

export default Content;