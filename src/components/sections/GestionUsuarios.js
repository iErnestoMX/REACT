import React, { useState, useEffect } from 'react';

const GestionUsuarios = ({ onBack }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioLoggeado = JSON.parse(localStorage.getItem("usuarioActual"));
    
    setUsuarios(usuariosGuardados);
    setUsuarioActual(usuarioLoggeado);
  }, []);

  const eliminarUsuario = (username) => {
    if (username === usuarioActual?.username) {
      alert("❌ No puedes eliminar tu propio usuario");
      return;
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${username}"?`)) {
      const usuariosActualizados = usuarios.filter(u => u.username !== username);
      setUsuarios(usuariosActualizados);
      localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
      
      // También eliminar el carrito del usuario si existe
      localStorage.removeItem(`carrito_${username}`);
      localStorage.removeItem(`tarjetas_${username}`);
      
      alert(`✅ Usuario "${username}" eliminado correctamente`);
    }
  };

  const cambiarTipoUsuario = (username, nuevoTipo) => {
    if (username === usuarioActual?.username) {
      alert("❌ No puedes cambiar tu propio tipo de usuario");
      return;
    }

    const usuariosActualizados = usuarios.map(u => 
      u.username === username ? { ...u, tipo: nuevoTipo } : u
    );
    
    setUsuarios(usuariosActualizados);
    localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
    
    alert(`✅ Usuario "${username}" ahora es ${nuevoTipo}`);
  };

  const crearUsuarioAdmin = () => {
    const username = prompt("Ingresa el nombre de usuario para el nuevo admin:");
    if (!username) return;

    const password = prompt("Ingresa la contraseña:");
    if (!password) return;

    const usuarioExistente = usuarios.find(u => u.username === username);
    if (usuarioExistente) {
      alert("❌ El usuario ya existe");
      return;
    }

    const nuevoUsuario = {
      username,
      password,
      tipo: "admin"
    };

    const usuariosActualizados = [...usuarios, nuevoUsuario];
    setUsuarios(usuariosActualizados);
    localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
    
    alert(`✅ Nuevo admin "${username}" creado correctamente`);
  };

  const usuariosCompradores = usuarios.filter(u => u.tipo === "comprador");
  const usuariosAdmins = usuarios.filter(u => u.tipo === "admin");

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {/* Header centrado */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#333',
          marginBottom: '10px',
          fontSize: '2rem'
        }}>
          👥 Gestión de Usuarios
        </h2>
        <p style={{ 
          color: '#666',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Administra los usuarios del sistema
        </p>
      </header>

      {/* Resumen centrado */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginBottom: '40px',
        padding: '25px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <h3 style={{ color: '#007bff', margin: '0 0 5px 0', fontSize: '1rem' }}>Total Usuarios</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#007bff' }}>
            {usuarios.length}
          </p>
        </div>
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <h3 style={{ color: '#28a745', margin: '0 0 5px 0', fontSize: '1rem' }}>Compradores</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#28a745' }}>
            {usuariosCompradores.length}
          </p>
        </div>
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <h3 style={{ color: '#dc3545', margin: '0 0 5px 0', fontSize: '1rem' }}>Administradores</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#dc3545' }}>
            {usuariosAdmins.length}
          </p>
        </div>
      </div>

      {/* Botón para crear nuevo admin - Centrado */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button 
          onClick={crearUsuarioAdmin}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5a32a3';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6f42c1';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          👑 Crear Nuevo Administrador
        </button>
      </div>

      {/* Contenedor principal centrado */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Lista de Administradores */}
        <div style={{ 
          width: '100%',
          maxWidth: '800px'
        }}>
          <h3 style={{ 
            textAlign: 'center',
            color: '#dc3545',
            marginBottom: '20px',
            fontSize: '1.5rem'
          }}>
            👑 Administradores ({usuariosAdmins.length})
          </h3>
          {usuariosAdmins.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              No hay administradores en el sistema
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {usuariosAdmins.map((usuario, index) => (
                <div key={index} style={{
                  border: '2px solid #dc3545',
                  borderRadius: '10px',
                  padding: '20px',
                  backgroundColor: '#fff5f5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ fontSize: '1.1rem' }}>👤 {usuario.username}</strong>
                      <br />
                      <span style={{ 
                        color: '#dc3545', 
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        backgroundColor: '#ffe6e6',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        ADMINISTRADOR
                      </span>
                    </div>
                    {usuario.username !== usuarioActual?.username && (
                      <button 
                        onClick={() => eliminarUsuario(usuario.username)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                  {usuario.username !== usuarioActual?.username && (
                    <div style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => cambiarTipoUsuario(usuario.username, 'comprador')}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: '#ffc107',
                          color: 'black',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}
                      >
                        🔄 Convertir a Comprador
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista de Compradores */}
        <div style={{ 
          width: '100%',
          maxWidth: '800px'
        }}>
          <h3 style={{ 
            textAlign: 'center',
            color: '#28a745',
            marginBottom: '20px',
            fontSize: '1.5rem'
          }}>
            🛒 Compradores ({usuariosCompradores.length})
          </h3>
          {usuariosCompradores.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              No hay compradores en el sistema
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {usuariosCompradores.map((usuario, index) => (
                <div key={index} style={{
                  border: '2px solid #28a745',
                  borderRadius: '10px',
                  padding: '20px',
                  backgroundColor: '#f8fff9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ fontSize: '1.1rem' }}>👤 {usuario.username}</strong>
                      <br />
                      <span style={{ 
                        color: '#28a745', 
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        backgroundColor: '#e6ffe6',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        COMPRADOR
                      </span>
                    </div>
                    <button 
                      onClick={() => eliminarUsuario(usuario.username)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => cambiarTipoUsuario(usuario.username, 'admin')}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}
                    >
                      👑 Convertir a Administrador
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button 
          onClick={onBack}
          style={{
            padding: '12px 30px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#545b62';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6c757d';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ↩️ Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default GestionUsuarios;