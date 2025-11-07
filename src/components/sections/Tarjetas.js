import React, { useState, useEffect, useRef, useCallback } from 'react';

const Tarjetas = () => {
  const [vistaActual, setVistaActual] = useState('configurar');
  const [texto, setTexto] = useState('Tu texto aquí');
  const [colorTexto, setColorTexto] = useState('#ff0000');
  const [fontSize, setFontSize] = useState(24);
  const [tipoLetra, setTipoLetra] = useState('Arial');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [tarjetas, setTarjetas] = useState([]);
  
  const canvasRef = useRef(null);

  const actualizarPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colorTexto;
    ctx.font = `${fontSize}px ${tipoLetra}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(texto, canvas.width / 2, canvas.height / 2);
  }, [texto, colorTexto, fontSize, tipoLetra, bgColor]);

  useEffect(() => {
    if (vistaActual === 'mis-tarjetas') {
      mostrarTarjetasGuardadas();
    }
  }, [vistaActual]);

  useEffect(() => {
    actualizarPreview();
  }, [actualizarPreview]);

  const mostrarTarjetasGuardadas = () => {
    const usuario = localStorage.getItem("loggedIn");
    const tarjetasGuardadas = JSON.parse(localStorage.getItem(`tarjetas_${usuario}`)) || [];
    setTarjetas(tarjetasGuardadas);
  };

  const exportarTarjeta = () => {
    const username = localStorage.getItem("loggedIn");
    if (!username) {
      alert("Debes iniciar sesión para guardar la tarjeta");
      return;
    }

    const dataURL = canvasRef.current.toDataURL("image/png");
    const tarjetasGuardadas = JSON.parse(localStorage.getItem(`tarjetas_${username}`)) || [];
    tarjetasGuardadas.push(dataURL);
    localStorage.setItem(`tarjetas_${username}`, JSON.stringify(tarjetasGuardadas));
    alert("Tarjeta guardada exitosamente!");
    setVistaActual('mis-tarjetas');
  };

  const descargarTarjeta = (dataURL) => {
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = `tarjeta.png`;
    a.click();
  };

  const eliminarTarjeta = (dataURL) => {
    if (window.confirm("¿Deseas eliminar esta tarjeta?")) {
      const usuario = localStorage.getItem("loggedIn");
      let tarjetasActualizadas = tarjetas.filter(t => t !== dataURL);
      localStorage.setItem(`tarjetas_${usuario}`, JSON.stringify(tarjetasActualizadas));
      setTarjetas(tarjetasActualizadas);
    }
  };

  return (
    <section id="tarjetas-seccion">
        <h2 style={{ textAlign: 'center' }}>Tarjetas Personalizadas</h2>

      {/* Navegación entre vistas */}
      <div style={{ 
        display: 'flex', 

        justifyContent: 'center', 
        gap: '20px', 
        marginBottom: '30px',
        borderBottom: '2px solid #ccc',
        paddingBottom: '10px'
      }}>
        <button 
          onClick={() => setVistaActual('configurar')}
          style={{
            padding: '10px 20px',
            backgroundColor: vistaActual === 'configurar' ? '#007bff' : '#f8f9fa',
            color: vistaActual === 'configurar' ? 'white' : 'black',
            border: '1px solid #007bff',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Crear Tarjeta
        </button>
        <button 
          onClick={() => setVistaActual('mis-tarjetas')}
          style={{
            padding: '10px 20px',
            backgroundColor: vistaActual === 'mis-tarjetas' ? '#007bff' : '#f8f9fa',
            color: vistaActual === 'mis-tarjetas' ? 'white' : 'black',
            border: '1px solid #007bff',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Mis Tarjetas ({tarjetas.length})
        </button>
      </div>

      {/* Vista de Configuración */}
      {vistaActual === 'configurar' && (
        <div id="tarjeta-configurator" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}>
            {/* Panel de controles */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid #ccc',
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: '#f9f9f9',
              minWidth: '300px'
            }}>
              <h3>Personalizar Tarjeta</h3>
              
              <div>
                <label htmlFor="txtTarjeta">Texto:</label>
                <input 
                  type="text" 
                  id="txtTarjeta" 
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  style={{ width: '100%', textAlign: 'center', marginTop: '5px' }}
                />
              </div>

              <div>
                <label htmlFor="colorTexto">Color del texto:</label>
                <input 
                  type="color" 
                  id="colorTexto" 
                  value={colorTexto}
                  onChange={(e) => setColorTexto(e.target.value)}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </div>

              <div>
                <label htmlFor="fontSize">Tamaño de fuente:</label>
                <input 
                  type="range" 
                  id="fontSize" 
                  min="10" 
                  max="100" 
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  style={{ width: '100%', marginTop: '5px' }}
                />
                <span>{fontSize}px</span>
              </div>

              <div>
                <label htmlFor="tipoLetra">Tipo de letra:</label>
                <select 
                  id="tipoLetra" 
                  value={tipoLetra}
                  onChange={(e) => setTipoLetra(e.target.value)}
                  style={{ width: '100%', marginTop: '5px' }}
                >
                  <option value="Arial">Arial</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                </select>
              </div>

              <div>
                <label htmlFor="bgColor">Color de fondo:</label>
                <input 
                  type="color" 
                  id="bgColor" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </div>

              <button 
                onClick={exportarTarjeta}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                💾 Guardar Tarjeta
              </button>
            </div>

            {/* Vista previa */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <h3>Vista Previa</h3>
              <canvas 
                ref={canvasRef}
                id="canvasTarjeta" 
                width="400" 
                height="250" 
                style={{ 
                  border: '2px solid #333',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              ></canvas>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Tamaño: 400x250 px
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Mis Tarjetas */}
      {vistaActual === 'mis-tarjetas' && (
        <div id="mis-tarjetas">
          {tarjetas.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#666'
            }}>
              <h3>No tienes tarjetas guardadas</h3>
              <p>Crea tu primera tarjeta personalizada</p>
              <button 
                onClick={() => setVistaActual('configurar')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Crear Tarjeta
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                Mis Tarjetas Guardadas ({tarjetas.length})
              </h3>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '20px', 
                justifyContent: 'center' 
              }}>
                {tarjetas.map((dataURL, index) => (
                  <div 
                    key={index}
                    style={{
                      border: '1px solid #ccc',
                      padding: '15px',
                      textAlign: 'center',
                      borderRadius: '10px',
                      backgroundColor: '#f9f9f9',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <img 
                      src={dataURL}
                      alt={`Tarjeta ${index + 1}`}
                      style={{
                        width: '200px',
                        height: '125px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                    <div style={{ marginTop: '10px' }}>
                      <button 
                        onClick={() => descargarTarjeta(dataURL)}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          marginBottom: '5px'
                        }}
                      >
                        📥 Descargar
                      </button>
                      <button 
                        onClick={() => eliminarTarjeta(dataURL)}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default Tarjetas;