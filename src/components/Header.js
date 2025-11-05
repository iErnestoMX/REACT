import React from 'react';

const Header = ({ usuarioActual, carritoCount, onLogout, onChangeSection }) => {
  const handleCambiarColor = () => {
    document.body.classList.toggle("modo-oscuro");
    if (document.body.classList.contains("modo-oscuro")) {
      localStorage.setItem("modo", "oscuro");
    } else {
      localStorage.setItem("modo", "claro");
    }
  };

  const handleGestionarUsuarios = () => {
    if (usuarioActual?.tipo === 'admin') {
      onChangeSection('gestion-usuarios');
    }
  };

  return (
    <header>
      <h2 id="tituloPapeleria">PAPELERÍA KAREN</h2>

      <button id="logout" className="logout-btn" onClick={onLogout}>
        Cerrar sesión
      </button>
      <button id="cambiarColor" onClick={handleCambiarColor}>
        Cambiar color
      </button>
      
      {usuarioActual?.tipo === 'admin' && (
        <>
          <button id="inventario" onClick={() => onChangeSection('inventario')}>
            Inventario
          </button>
          <button id="gestionUsuarios" onClick={handleGestionarUsuarios}>
            👥 Gestionar Usuarios
          </button>
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {/* Botón de Favoritos */}
        <div 
          id="favoritos-icono" 
          style={{ 
            position: 'relative', 
            cursor: 'pointer', 
            marginLeft: 'auto',
            marginRight: '15px',
            fontSize: '32px',
            padding: '8px'
          }}
          onClick={() => onChangeSection('favoritos')}
          title="Mis Favoritos"
        >
          
        </div>

        {/* Icono del Carrito */}
        <div 
          id="carrito-icono" 
          style={{ 
            position: 'relative', 
            cursor: 'pointer', 
            fontSize: '32px',
            padding: '8px'
          }}
          onClick={() => onChangeSection('carrito')}
        >
          🛒
          <span 
            id="contadorCarrito"
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
          >
            {carritoCount}
          </span>  
        </div>
      </div>

      <div id="usuario-info" style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: '#fcccf1ff',
        padding: '5px 10px',
        borderRadius: '8px',
        fontWeight: 'bold',
        zIndex: '1000'
      }}>
        Rol: {usuarioActual?.tipo}
      </div>

      <nav>
        <ul>
          <li><a href="#" onClick={() => onChangeSection('articulos')}><p style={{ fontFamily: 'Comic Sans MS' }}>Articulos</p></a></li>
          <li><a href="#" onClick={() => onChangeSection('tarjetas')}><p style={{ fontFamily: 'Comic Sans MS' }}>Tarjetas</p></a></li>
          <li><a href="#" onClick={() => onChangeSection('tarjeta')}><p style={{ fontFamily: 'Comic Sans MS' }}>Presentaciones</p></a></li>
          {/* Agregar Favoritos al menú de navegación */}
          <li><a href="#" onClick={() => onChangeSection('favoritos')}><p style={{ fontFamily: 'Comic Sans MS' }}>Favoritos</p></a></li>
          {usuarioActual?.tipo === 'admin' && (
            <li><a href="#" onClick={() => onChangeSection('dashboard')}><p style={{ fontFamily: 'Comic Sans MS' }}>Dashboard</p></a></li>
          )}
          <li><a href="#" onClick={() => onChangeSection('portafolio')}><p style={{ fontFamily: 'Comic Sans MS' }}>Portafolio</p></a></li>
          <li><a href="#" onClick={() => onChangeSection('contacto')}><p style={{ fontFamily: 'Comic Sans MS' }}>Contacto</p></a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;