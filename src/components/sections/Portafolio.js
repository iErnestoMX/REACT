import React from 'react';

const Portafolio = () => {
  return (
    <>
      <h2>Portafolio Personal</h2>
      <section className="portafolio">
        <div className="perfil">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
            alt="Perfil" 
            className="perfil-img" 
          />
          <h3>Ernesto</h3>
          <p>Desarrollador Web</p>
        </div>

        <div className="proyectos">
          <h3>Proyectos Destacados</h3>
          <div className="proyecto">
            <h4>Sistema de Inventario</h4>
            <p>Aplicación web para control de inventarios con login, CRUD y reportes visuales.</p>
          </div>
          <div className="proyecto">
            <h4>Plataforma de Ventas</h4>
            <p>Frontend y backend completo con base de datos MySQL y panel de administración.</p>
          </div>
          <div className="proyecto">
            <h4>Landing Page para Negocio Local</h4>
            <p>Diseño minimalista y adaptable, con integración de redes sociales y mapa.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Portafolio;