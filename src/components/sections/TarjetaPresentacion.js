import React from 'react';

const ArticulosTemporada = () => {
  const productosNavidad = [
    { 
      nombre: "Esferas Navideñas", 
      precio: "$45", 
      descripcion: "Set de 12 esferas brillantes",
      imagen: "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=200&h=150&fit=crop",
      stock: "Disponible"
    },
    { 
      nombre: "Luces LED Navideñas", 
      precio: "$120", 
      descripcion: "Tira de luces multicolor 5m",
      imagen: "https://images.unsplash.com/photo-1574359411659-619743e166b8?w=200&h=150&fit=crop",
      stock: "Disponible"
    },
    { 
      nombre: "Árbol de Navidad", 
      precio: "$650", 
      descripcion: "Árbol artificial 1.80m",
      imagen: "https://images.unsplash.com/photo-1606836133735-11c6419d6e6a?w=200&h=150&fit=crop",
      stock: "Últimas unidades"
    },
    { 
      nombre: "Corona Navideña", 
      precio: "$85", 
      descripcion: "Corona para puerta con adornos",
      imagen: "https://images.unsplash.com/photo-1542605127-2a0b0f4df8c7?w=200&h=150&fit=crop",
      stock: "Disponible"
    },
    { 
      nombre: "Calcetines Navideños", 
      precio: "$35", 
      descripcion: "Pack de 4 calcetines para regalos",
      imagen: "https://images.unsplash.com/photo-1574359411659-619743e166b8?w=200&h=150&fit=crop",
      stock: "Disponible"
    },
    { 
      nombre: "Villancicos CD", 
      precio: "$60", 
      descripcion: "Colección de villancicos clásicos",
      imagen: "https://images.unsplash.com/photo-1574359411659-619743e166b8?w=200&h=150&fit=crop",
      stock: "Disponible"
    }
  ];

  // Dividir productos en filas de 4
  const filas = [];
  for (let i = 0; i < productosNavidad.length; i += 4) {
    filas.push(productosNavidad.slice(i, i + 4));
  }

  return (
    <>
      <h2 style={{textAlign: 'center', color: '#d63031', marginBottom: '30px'}}>
        🎄 Artículos de Temporada - Navidad 🎄
      </h2>
      
      {/* Contenedor principal con filas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {filas.map((fila, filaIndex) => (
          <div 
            key={filaIndex}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              justifyContent: 'center'
            }}
          >
            {fila.map((producto, index) => (
              <div 
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                  border: '2px solid #d63031',
                  borderRadius: '15px',
                  padding: '15px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(214, 48, 49, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(214, 48, 49, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(214, 48, 49, 0.2)';
                }}
              >
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    marginBottom: '12px',
                    border: '2px solid #ffeaa7'
                  }}
                />
                <h3 style={{
                  color: '#2d3436', 
                  margin: '8px 0', 
                  fontSize: '1.1em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {producto.nombre}
                </h3>
                <p style={{
                  color: '#636e72', 
                  margin: '6px 0', 
                  fontSize: '0.85em',
                  height: '40px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {producto.descripcion}
                </p>
                <div style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '12px'
                }}>
                  <span style={{
                    fontWeight: 'bold', 
                    color: '#d63031', 
                    fontSize: '1.2em'
                  }}>
                    {producto.precio}
                  </span>
                  <span style={{
                    fontSize: '0.75em',
                    padding: '4px 8px',
                    borderRadius: '10px',
                    background: producto.stock === 'Disponible' ? '#e8f5e8' : 
                              producto.stock === 'Últimas unidades' ? '#fff3cd' : '#ffebee',
                    color: producto.stock === 'Disponible' ? '#2e7d32' : 
                          producto.stock === 'Últimas unidades' ? '#856404' : '#c62828',
                    border: `1px solid ${producto.stock === 'Disponible' ? '#c8e6c9' : 
                            producto.stock === 'Últimas unidades' ? '#ffeaa7' : '#ffcdd2'}`
                  }}>
                    {producto.stock}
                  </span>
                </div>
                <button style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #d63031, #e17055)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9em',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #e17055, #d63031)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #d63031, #e17055)';
                  e.target.style.transform = 'scale(1)';
                }}>
                  🛒 Agregar
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Oferta especial */}
      <div style={{
        textAlign: 'center', 
        marginTop: '30px',
        padding: '15px',
        background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
        borderRadius: '10px',
        border: '2px dashed #d63031'
      }}>
        <h3 style={{color: '#2d3436', margin: '0 0 10px 0'}}>🎁 ¡Oferta Especial de Navidad! 🎁</h3>
        <p style={{color: '#636e72', fontSize: '1em', margin: 0}}>
          Compra 3 artículos y obtén un 20% de descuento + envío gratis
        </p>
      </div>
    </>
  );
};

export default ArticulosTemporada;