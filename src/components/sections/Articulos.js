import React, { useState, useEffect, useRef } from 'react';
import { obtenerCarrito, guardarCarrito, obtenerInventario, guardarInventario } from '../../utils/carritoUtils';
import { agregarAFavoritos, eliminarDeFavoritos, estaEnFavoritos } from '../../utils/favoritosUtils';

const Articulos = ({ onUpdateCarrito }) => {
  const [articulos, setArticulos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [indiceInicio, setIndiceInicio] = useState(0);
  const [favoritos, setFavoritos] = useState({});
  const [imagenesActuales, setImagenesActuales] = useState({});
  const articulosContainerRef = useRef(null);

  const ARTICULOS_POR_FILA = 4;

  // Imágenes extra para cada artículo
  const imagenesExtra = {
    "Colores": [
      "https://i.postimg.cc/QMYctmWy/Colores.png",
      "https://i.postimg.cc/1X3pRP63/Colores-Primas.png",
      "https://i.postimg.cc/fWqd7Gm3/Colores-Videl.png"
    ],
    "Cuadernos": [
      "https://i.postimg.cc/Df4GgC62/Cuaderno-Jean-Book.png",
      "https://i.postimg.cc/k4b5xHmp/Cuaderno-Scribe.png",
      "https://i.postimg.cc/nztyPSmT/Cuaderno-Estrella.png"
    ],
    "Lápices Adhesivos": [
      "https://i.postimg.cc/ncs3qYjz/Pegamento-Dixon.png",
      "https://i.postimg.cc/yYSTD1tF/Lapiz-Pritt-removebg-preview.png",
      "https://i.postimg.cc/G34fj16d/Prit-Buy.png"
    ],
    "Lápices": [
      "https://i.postimg.cc/YCPGYYFr/01280115-removebg-preview.png",
      "https://i.postimg.cc/J0hMpdwQ/Lapiz-Mape.png",
      "https://i.postimg.cc/90S5JmYt/Lapices-Bic.png"
    ],
    "Plumas": [
      "https://i.postimg.cc/fbMF7SQH/Plumas-Paper.png",
      "https://i.postimg.cc/MTn8Rf1L/Plumas-Bic.png",
      "https://i.postimg.cc/qRh9gVTV/Plumas-Gel.png"
    ],
    "Engrapadoras": [
      "https://i.postimg.cc/447VqLSW/Engrapadora-removebg-preview.png",
      "https://i.postimg.cc/Mpb4qzdB/Engrapadora-Mini.png",
      "https://i.postimg.cc/QMfyK0LG/Engrapadora-Tipo-Pistola.png"
    ],
    "Hojas de carpeta": [
      "https://i.postimg.cc/wjtCmdfx/Hojas-de-carpeta.png",
      "https://i.postimg.cc/ZKjpSg6K/Hojas-Kiel.png",
      "https://i.postimg.cc/kgpSVb13/Hojas-Mate.png"
    ],
    "Plastilina": [
      "https://i.postimg.cc/3wTtxMPQ/Plastilina.png",
      "https://i.postimg.cc/KvVcBD2J/Plastilina-Vinci.png",
      "https://i.postimg.cc/xdG0rrb3/Plastilina-Pelikan.png"
    ],
    "Pegamento blanco": [
      "https://i.postimg.cc/JzWNbNK0/Pegamento-Blanco.png",
      "https://i.postimg.cc/7LQyrxZT/pegamento-Bully.png",
      "https://i.postimg.cc/9M65zJTy/Pegamento-Dixon.png"
    ]
  };

  useEffect(() => {
    const articulosData = [
      { nombre: "Colores", price: 95, img: "https://i.postimg.cc/QMYctmWy/Colores.png", desc: "Pigmentos vivos, punta resistente y trazos uniformes." },
      { nombre: "Cuadernos", price: 28, img: "https://i.postimg.cc/Df4GgC62/Cuaderno-Jean-Book.png", desc: "Pasta dura, diseño moderno y hojas cuadriculadas." },
      { nombre: "Lápices Adhesivos", price: 18, img: "https://i.postimg.cc/ncs3qYjz/Pegamento-Dixon.png", desc: "Ideal para pegar papel, cartón y fotos sin ensuciar." },
      { nombre: "Lápices", price: 5, img: "https://i.postimg.cc/YCPGYYFr/01280115-removebg-preview.png", desc: "Punta resistente y madera ecológica para trazos suaves." },
      { nombre: "Plumas", price: 10, img: "https://i.postimg.cc/fbMF7SQH/Plumas-Paper.png", desc: "Escritura fluida, colores intensos y gran durabilidad." },
      { nombre: "Engrapadoras", price: 25, img: "https://i.postimg.cc/447VqLSW/Engrapadora-removebg-preview.png", desc: "Diseño ergonómico para un engrape fácil." },
      { nombre: "Hojas de carpeta", price: 50, img: "https://i.postimg.cc/wjtCmdfx/Hojas-de-carpeta.png", desc: "Papel de alta calidad para archivar documentos." },
      { nombre: "Plastilina", price: 18, img: "https://i.postimg.cc/3wTtxMPQ/Plastilina.png", desc: "Colores vibrantes y textura suave." },
      { nombre: "Pegamento blanco", price: 25, img: "https://i.postimg.cc/JzWNbNK0/Pegamento-Blanco.png", desc: "Adhesivo fuerte y de secado rápido." },
    ];
    setArticulos(articulosData);
    localStorage.setItem("articulos", JSON.stringify(articulosData));

    // Inicializar imágenes actuales
    const imagenesIniciales = {};
    articulosData.forEach(articulo => {
      imagenesIniciales[articulo.nombre] = 0; // Índice de imagen actual
    });
    setImagenesActuales(imagenesIniciales);

    // Cargar inventario
    const inventarioExistente = JSON.parse(localStorage.getItem("inventario")) || [];
    if (inventarioExistente.length === 0) {
      const inventarioInicial = articulosData.map(articulo => ({
        nombre: articulo.nombre,
        precio: articulo.price,
        cantidad: 10
      }));
      localStorage.setItem("inventario", JSON.stringify(inventarioInicial));
      setInventario(inventarioInicial);
    } else {
      setInventario(inventarioExistente);
    }

    // Cargar estado de favoritos
    const favoritosEstado = {};
    articulosData.forEach(articulo => {
      favoritosEstado[articulo.nombre] = estaEnFavoritos(articulo.nombre);
    });
    setFavoritos(favoritosEstado);
  }, []);

  // Efecto para el carrusel automático de imágenes
  useEffect(() => {
    const intervalos = {};
    
    articulos.forEach(articulo => {
      const imagenes = imagenesExtra[articulo.nombre];
      if (imagenes && imagenes.length > 1) {
        intervalos[articulo.nombre] = setInterval(() => {
          setImagenesActuales(prev => ({
            ...prev,
            [articulo.nombre]: (prev[articulo.nombre] + 1) % imagenes.length
          }));
        }, 2500); // Cambia cada 2.5 segundos
      }
    });

    return () => {
      // Limpiar intervalos al desmontar
      Object.values(intervalos).forEach(interval => clearInterval(interval));
    };
  }, [articulos]);

  const obtenerCantidadDisponible = (nombreArticulo) => {
    const producto = inventario.find(item => item.nombre === nombreArticulo);
    return producto ? producto.cantidad : 0;
  };

  const toggleFavorito = (articulo) => {
    if (favoritos[articulo.nombre]) {
      eliminarDeFavoritos(articulo.nombre);
      setFavoritos(prev => ({
        ...prev,
        [articulo.nombre]: false
      }));
      alert(`❌ ${articulo.nombre} eliminado de favoritos`);
    } else {
      const agregado = agregarAFavoritos(articulo);
      if (agregado) {
        setFavoritos(prev => ({
          ...prev,
          [articulo.nombre]: true
        }));
        alert(`⭐ ${articulo.nombre} agregado a favoritos`);
      }
    }
  };

  const agregarAlCarrito = (articulo) => {
    const cantidadDisponible = obtenerCantidadDisponible(articulo.nombre);
    
    if (cantidadDisponible <= 0) {
      alert(`❌ No hay stock disponible de ${articulo.nombre}`);
      return;
    }

    // Descontar del inventario
    const inventarioActualizado = inventario.map(item => {
      if (item.nombre === articulo.nombre) {
        return {
          ...item,
          cantidad: item.cantidad - 1
        };
      }
      return item;
    });

    localStorage.setItem("inventario", JSON.stringify(inventarioActualizado));
    setInventario(inventarioActualizado);

    // Agregar al carrito
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(i => i.name === articulo.nombre);
    
    if (index >= 0) {
      carrito[index].qty += 1;
    } else {
      carrito.push({ 
        name: articulo.nombre, 
        qty: 1, 
        price: articulo.price, 
        img: articulo.img 
      });
    }

    guardarCarrito(carrito);
    alert(`✅ ${articulo.nombre} agregado al carrito\n📦 Stock restante: ${cantidadDisponible - 1}`);
    onUpdateCarrito();
    window.dispatchEvent(new Event('storage'));
  };

  const siguiente = () => {
    if (indiceInicio + ARTICULOS_POR_FILA < articulos.length) {
      setIndiceInicio(indiceInicio + 1);
    }
  };

  const anterior = () => {
    if (indiceInicio > 0) {
      setIndiceInicio(indiceInicio - 1);
    }
  };

  const articulosVisibles = articulos.slice(indiceInicio, indiceInicio + ARTICULOS_POR_FILA);

  return (
    <>
        <h2>Artículos</h2>
      <p>Se muestran imágenes de los <strong>artículos en venta</strong> y <em>su costo</em>, de la <abbr title="Papelería Karen">PapeKaren</abbr></p>

      {/* Controles del carrusel */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <button 
          onClick={anterior}
          disabled={indiceInicio === 0}
          style={{
            padding: '10px 15px',
            backgroundColor: indiceInicio === 0 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: indiceInicio === 0 ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ◀
        </button>

        <div style={{
          fontSize: '14px',
          color: '#666',
          textAlign: 'center'
        }}>
          Mostrando {indiceInicio + 1}-{Math.min(indiceInicio + ARTICULOS_POR_FILA, articulos.length)} de {articulos.length} artículos
        </div>

        <button 
          onClick={siguiente}
          disabled={indiceInicio + ARTICULOS_POR_FILA >= articulos.length}
          style={{
            padding: '10px 15px',
            backgroundColor: indiceInicio + ARTICULOS_POR_FILA >= articulos.length ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: indiceInicio + ARTICULOS_POR_FILA >= articulos.length ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ▶
        </button>
      </div>

      {/* Contenedor horizontal de artículos */}
      <div 
        ref={articulosContainerRef}
        style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          overflowX: 'auto',
          justifyContent: 'center',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {articulosVisibles.map((articulo, index) => {
          const cantidadDisponible = obtenerCantidadDisponible(articulo.nombre);
          const sinStock = cantidadDisponible <= 0;
          const esFavorito = favoritos[articulo.nombre];
          const imagenes = imagenesExtra[articulo.nombre] || [articulo.img];
          const imagenActual = imagenes[imagenesActuales[articulo.nombre] || 0];
          const tieneCarrusel = imagenes.length > 1;

          return (
            <div 
              key={index} 
              style={{
                border: `2px solid ${sinStock ? '#ff6b6b' : esFavorito ? '#ff6b8b' : '#e0e0e0'}`,
                borderRadius: '12px',
                padding: '15px',
                backgroundColor: sinStock ? '#fff5f5' : esFavorito ? '#fff0f3' : '#ffffff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                width: '250px',
                minWidth: '250px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                opacity: sinStock ? 0.7 : 1,
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!sinStock) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!sinStock) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }
              }}
            >
              {/* Botón de favorito */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorito(articulo);
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  zIndex: 10
                }}
                title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                {esFavorito ? '⭐' : '☆'}
              </button>

              {/* Contenedor de imagen con carrusel automático */}
              <div style={{
                width: '100%',
                height: '150px',
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '15px',
                position: 'relative'
              }}>
                <img 
                  src={imagenActual} 
                  alt={articulo.nombre} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'opacity 0.5s ease'
                  }}
                />

                {/* Indicadores de posición (solo puntos) */}
                {tieneCarrusel && (
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '4px',
                    zIndex: 5
                  }}>
                    {imagenes.map((_, imgIndex) => (
                      <div
                        key={imgIndex}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: imgIndex === imagenesActuales[articulo.nombre] ? '#007bff' : 'rgba(255,255,255,0.5)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <h3 style={{
                  margin: '0',
                  fontSize: '16px',
                  color: '#333',
                  textAlign: 'center',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {articulo.nombre}
                </h3>
                
                <p style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#007bff',
                  textAlign: 'center',
                  margin: '0'
                }}>
                  ${articulo.price}
                </p>

                <p style={{
                  fontSize: '11px',
                  color: '#666',
                  textAlign: 'center',
                  margin: '0',
                  height: '32px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {articulo.desc}
                </p>

                {/* Indicador de stock */}
                <div style={{
                  padding: '5px 10px',
                  backgroundColor: sinStock ? '#ff6b6b' : 
                                 cantidadDisponible <= 5 ? '#ffa94d' : '#51cf66',
                  color: 'white',
                  borderRadius: '15px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {sinStock ? '❌ AGOTADO' : 
                   cantidadDisponible <= 5 ? `⚠️ Últimas ${cantidadDisponible}` : 
                   `📦 Stock: ${cantidadDisponible}`}
                </div>

                {/* Botones de acción */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: 'auto'
                }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      agregarAlCarrito(articulo);
                    }}
                    disabled={sinStock}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: sinStock ? '#ccc' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: sinStock ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      if (!sinStock) {
                        e.target.style.backgroundColor = '#0056b3';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!sinStock) {
                        e.target.style.backgroundColor = '#007bff';
                      }
                    }}
                  >
                    {sinStock ? '❌ Agotado' : '🛒 Carrito'}
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorito(articulo);
                    }}
                    style={{
                      padding: '10px',
                      backgroundColor: esFavorito ? '#dc3545' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      minWidth: '40px'
                    }}
                    title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {esFavorito ? '⭐' : '☆'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores de navegación */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        marginTop: '20px',
        flexWrap: 'wrap'
      }}>
        {Array.from({ length: Math.ceil(articulos.length / ARTICULOS_POR_FILA) }, (_, i) => (
          <button
            key={i}
            onClick={() => setIndiceInicio(i * ARTICULOS_POR_FILA)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: indiceInicio === i * ARTICULOS_POR_FILA ? '#007bff' : '#ccc',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      {/* Botón volver al inicio */}
      <div style={{ 
        width: '100%', 
        textAlign: 'center', 
        marginTop: '30px',
        padding: '20px'
      }}>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ↩️ Volver al inicio
        </button>
      </div>

      {/* Ocultar scrollbar */}
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </>
  );
};

export default Articulos;