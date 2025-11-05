import React from 'react';

const Inicio = ({ onChangeSection }) => {
  return (
    <>
      <h2>INICIO</h2>
      <p>Explora nuestros Articulos en Venta buen precio.</p>
      
      <aside>
        <p>Contenido relacionado o anuncios derechos de autor.</p>
      </aside>
      
      <footer>
        <small>&copy; Arenas Olvera Jorge Eduardo, Molotla colin Angel Kaleb, Rayas Batalla Ernesto Adrian, Rodriguez Catro Alfredo, Sanchez Toriz Victor Eduardo</small>
        <address>Contacto: <a href="mailto:papeleriakaren@gmail.com">papeleriakaren@gmail.com</a></address>
      </footer>
      
      <ul>
        <li><a href="https://www.google.com" target="_blank" rel="noopener noreferrer">Google</a></li>
        <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
        <li><a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a></li>
        <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter/X</a></li>
      </ul>

      <h3>Calendario Papelería Karen</h3>
      <iframe 
        src="https://calendar.google.com/calendar/embed?src=d64c0cf7334f7b8601c50f453e22f66a7d8e7c9678961dc960036f6430736f92%40group.calendar.google.com&ctz=America%2FMexico_City" 
        style={{border: 0}}
        width="800" 
        height="600" 
        frameBorder="0" 
        scrolling="no"
        title="Calendario Papelería Karen"
      >
      </iframe>

      <button className="inicio-btn" onClick={() => onChangeSection('articulos')}>
        Ver Artículos
      </button>
    </>
  );
};

export default Inicio;