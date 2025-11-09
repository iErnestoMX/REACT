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


      <button className="inicio-btn" onClick={() => onChangeSection('articulos')}>
        Ver Artículos
      </button>
    </>
  );
};

export default Inicio;