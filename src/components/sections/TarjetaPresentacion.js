import React from 'react';

const TarjetaPresentacion = () => {
  const personas = [
    { nombre: "Ernesto Adrian", puesto: "Desarrollador BackEnd HackerNoFakeFullHD", email: "Ernesto1234@hotmail.com", color: "#f7a000" },
    { nombre: "Angel Kaleb", puesto: "Redes Lan FullHD", email: "Angel@hotmail.com", color: "#0c0c0c" },
    { nombre: "Jorge Eduardo", puesto: "Especializado En Hackr", email: "Eduhackr123@hotmail.com", color: "#011f58" },
    { nombre: "Sir Afedo Castro", puesto: "Plebello Caballero", email: "Sirafedod@hotmail.com", color: "#27f549" },
    { nombre: "Victor Eduardo", puesto: "Catador de pitos", email: "Lalosmlkf111@hotmail.com", color: "#ee24a0" }
  ];

  return (
    <>
      <h2>Presentaciones</h2>
      <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
        {personas.map((persona, index) => (
          <div 
            key={index}
            style={{
              border: `1px solid ${persona.color}`,
              borderRadius: '10px',
              width: '220px',
              padding: '10px',
              textAlign: 'center',
              boxShadow: '2px 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <img 
              src={`https://picsum.photos/200/130?random=${index + 1}`} 
              alt="Foto" 
              style={{
                borderRadius: '10px',
                width: '100%',
                height: '130px',
                objectFit: 'cover'
              }}
            />
            <h3>{persona.nombre}</h3>
            <p>{persona.puesto}</p>
            <p>📧 {persona.email}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default TarjetaPresentacion;