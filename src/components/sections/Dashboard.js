import React, { useState, useEffect, useCallback } from 'react';
import { obtenerCarrito, obtenerEstadisticasDashboard } from '../../utils/carritoUtils'; // Cambiado a ../../utils

const Dashboard = () => {
  const [showProveedores, setShowProveedores] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    clientesNuevos: 0,
    articulosStock: 0,
    ventasMensuales: 0
  });

  // Mover crearGraficasDashboard dentro del useEffect o usar useCallback
  const dibujarGraficaBarras = useCallback((ctx, datos, color, titulo) => {
    const anchoBarra = 25;
    const separacion = 20;
    const maxAltura = 150;
    const maxValor = Math.max(...datos) || 1;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Título
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(titulo, ctx.canvas.width / 2, 15);

    datos.forEach((dato, i) => {
      const x = 40 + i * (anchoBarra + separacion);
      const h = (dato / maxValor) * maxAltura;
      ctx.fillStyle = color;
      ctx.fillRect(x, ctx.canvas.height - h - 30, anchoBarra, h);
      
      // Valor
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(dato, x + anchoBarra / 2, ctx.canvas.height - h - 35);
    });
  }, []);

  const dibujarGraficaLineal = useCallback((ctx, datos, color, titulo) => {
    const maxAltura = 150;
    const maxValor = Math.max(...datos) || 1;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Título
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(titulo, ctx.canvas.width / 2, 15);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    datos.forEach((dato, i) => {
      const x = 40 + i * 40;
      const y = ctx.canvas.height - (dato / maxValor) * maxAltura - 40;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Puntos
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.stroke();
  }, []);

  const crearGraficasDashboard = useCallback(() => {
    // Usar datos reales del dashboard para las gráficas
    setTimeout(() => {
      const datosClientes = [dashboardData.clientesNuevos, dashboardData.clientesNuevos + 2, dashboardData.clientesNuevos + 1];
      const datosArticulos = [dashboardData.articulosStock - 2, dashboardData.articulosStock - 1, dashboardData.articulosStock];
      const datosVentas = [dashboardData.ventasMensuales - 50, dashboardData.ventasMensuales - 25, dashboardData.ventasMensuales];

      const ctxClientes = document.getElementById("graficaClientes")?.getContext('2d');
      const ctxArticulos = document.getElementById("graficaArticulos")?.getContext('2d');
      const ctxVentas = document.getElementById("graficaVentas")?.getContext('2d');
      
      if (ctxClientes) dibujarGraficaLineal(ctxClientes, datosClientes, "#42a5f5", "Clientes");
      if (ctxArticulos) dibujarGraficaBarras(ctxArticulos, datosArticulos, "#ffb74d", "Artículos");
      if (ctxVentas) dibujarGraficaLineal(ctxVentas, datosVentas, "#66bb6a", "Ventas");
    }, 100);
  }, [dashboardData, dibujarGraficaBarras, dibujarGraficaLineal]);

  const actualizarDashboard = useCallback(() => {
    const estadisticas = obtenerEstadisticasDashboard();
    setDashboardData(estadisticas);
  }, []);

  useEffect(() => {
    actualizarDashboard();
    crearGraficasDashboard();
    
    const handleStorageChange = () => {
      actualizarDashboard();
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(actualizarDashboard, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [actualizarDashboard, crearGraficasDashboard]);

  if (showProveedores) {
    return <GestorProveedores onBack={() => setShowProveedores(false)} />;
  }

  return (
    <>
      <h2>Dashboard</h2>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={actualizarDashboard}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔄 Actualizar Dashboard
        </button>
      </div>

      <div className="dashboard-cards" style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '40px',
        padding: '20px',
        background: 'linear-gradient(135deg, #fff8e1, #e1f5fe)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div className="card" style={{
          flex: 1,
          minWidth: '50px',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '15px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <h3>👥 Clientes Registrados</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#42a5f5', margin: '10px 0' }}>
            {dashboardData.clientesNuevos}
          </p>
          <canvas id="graficaClientes" width="180" height="180" style={{ marginTop: '10px' }}></canvas>
        </div>

        <div className="card" style={{
          flex: 1,
          minWidth: '250px',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '15px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <h3>🛒 Artículos en Carritos</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffb74d', margin: '0px 0' }}>
            {dashboardData.articulosStock}
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Total en todos los carritos
          </p>
          <canvas id="graficaArticulos" width="150" height="180" style={{ marginTop: '0px' }}></canvas>
        </div>

        <div className="card" style={{
          flex: 1,
          minWidth: '250px',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '15px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <h3>💰 Ventas Totales</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#66bb6a', margin: '0px 0' }}>
            ${dashboardData.ventasMensuales}
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Valor total en carritos
          </p>
          <canvas id="graficaVentas" width="280" height="180" style={{ marginTop: '0px' }}></canvas>
        </div>
      </div>

      {/* Información adicional */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h4>Información del Dashboard</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', marginTop: '15px' }}>
          <div>
            <strong>Carrito Actual:</strong> 
            <span style={{ color: '#007bff', marginLeft: '10px' }}>
              {obtenerCarrito().reduce((sum, item) => sum + (item.qty || 0), 0)} artículos
            </span>
          </div>
          <div>
            <strong>Usuarios Totales:</strong> 
            <span style={{ color: '#28a745', marginLeft: '10px' }}>
              {JSON.parse(localStorage.getItem("usuarios") || "[]").length}
            </span>
          </div>
          <div>
            <strong>Inventario:</strong> 
            <span style={{ color: '#ffc107', marginLeft: '10px' }}>
              {JSON.parse(localStorage.getItem("inventario") || "[]").length} productos
            </span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        <button 
          id="verProveedores" 
          onClick={() => setShowProveedores(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          👥 Ver Gestor de Proveedores
        </button>
      </div>
    </>
  );
};

// Componente GestorProveedores (mantener igual)
const GestorProveedores = ({ onBack }) => {
  const [proveedores, setProveedores] = useState(JSON.parse(localStorage.getItem("proveedores")) || []);
  const [nombreProveedor, setNombreProveedor] = useState('');
  const [marcaProveedor, setMarcaProveedor] = useState('');
  const [ticketProveedor, setTicketProveedor] = useState(null);

  const productos = {
    "Proveedor Plumas": [
      { nombre: "PlumasBic", precio: 13, unidad: 20 },
      { nombre: "PlumasGel", precio: 12, unidad: 30 },
      { nombre: "Plumas Normas", precio: 17, unidad: 20 },
      { nombre: "Plumas PaperMate", precio: 17, unidad: 10 }
    ],
    "Proveedor Lápices": [
      { nombre: "LápizMaped", precio: 4, unidad: 30 },
      { nombre: "Lápiz Bic", precio: 5, unidad: 30 },
      { nombre: "LápizMap", precio: 7, unidad: 12 },
      { nombre: "Lápiz Premium", precio: 17, unidad: 12 }
    ],
    "Proveedor Colores": [
      { nombre: "ColoresPrismas", precio: 4, unidad: 12 },
      { nombre: "ColoresVidel", precio: 5, unidad: 30 },
      { nombre: "ColoresNorma", precio: 7, unidad: 12 },
      { nombre: "Colores", precio: 17, unidad: 14 }
    ],
    "Proveedor Lápices Adhesivos": [
      { nombre: "Prit Dixon", precio: 4, unidad: 11 },
      { nombre: "LapizPritt", precio: 5, unidad: 14 },
      { nombre: "PritBuy", precio: 7, unidad: 15 },
      { nombre: "Pritt", precio: 17, unidad: 16 }
    ],
  };

  const agregarProveedor = (e) => {
    e.preventDefault();
    if (nombreProveedor && marcaProveedor) {
      const nuevoProveedor = { nombre: nombreProveedor, marca: marcaProveedor };
      const nuevosProveedores = [...proveedores, nuevoProveedor];
      setProveedores(nuevosProveedores);
      localStorage.setItem("proveedores", JSON.stringify(nuevosProveedores));
      setNombreProveedor('');
      setMarcaProveedor('');
    } else {
      alert("Por favor completa todos los campos");
    }
  };

  const eliminarProveedor = (index) => {
    const nuevosProveedores = proveedores.filter((_, i) => i !== index);
    setProveedores(nuevosProveedores);
    localStorage.setItem("proveedores", JSON.stringify(nuevosProveedores));
    setTicketProveedor(null);
  };

  const verTicket = (proveedor) => {
    setTicketProveedor(proveedor);
  };

  return (
    <>
      <h2>Gestor de Proveedores de Marcas</h2>
      <div id="gestor-proveedores" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form id="formProveedor" onSubmit={agregarProveedor}>
          <label htmlFor="nombreProveedor">Nombre del proveedor:</label>
          <input 
            type="text" 
            id="nombreProveedor" 
            value={nombreProveedor}
            onChange={(e) => setNombreProveedor(e.target.value)}
            required 
          />
          
          <label htmlFor="marcaProveedor">Marca asociada:</label>
          <input 
            type="text" 
            id="marcaProveedor" 
            value={marcaProveedor}
            onChange={(e) => setMarcaProveedor(e.target.value)}
            required 
          />
          
          <button type="submit">Agregar Proveedor</button>
        </form>

        <h3>Lista de Proveedores</h3>
        <ul id="listaProveedores">
          {proveedores.map((proveedor, index) => (
            <li key={index}>
              {proveedor.nombre} — Marca: {proveedor.marca}
              <button 
                onClick={() => eliminarProveedor(index)}
                style={{ marginLeft: '10px' }}
              >
                Eliminar
              </button>
              <button 
                onClick={() => verTicket(proveedor)}
                style={{ marginLeft: '10px' }}
              >
                Ver Ticket
              </button>
            </li>
          ))}
        </ul>

        <h3>Ticket del proveedor seleccionado</h3>
        <div id="ticketProveedor" style={{
          border: '1px dashed #333',
          padding: '10px',
          borderRadius: '8px',
          background: '#f9f9f9'
        }}>
          {ticketProveedor ? (
            <>
              <h4>Ticket de {ticketProveedor.nombre}</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {(productos[ticketProveedor.nombre] || []).map((prod, idx) => (
                    <tr key={idx}>
                      <td>{prod.nombre}</td>
                      <td>${prod.precio}</td>
                      <td>{prod.unidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ textAlign: 'right', fontWeight: 'bold' }}>
                Total: ${(productos[ticketProveedor.nombre] || []).reduce((acc, prod) => acc + prod.precio, 0)}
              </p>
            </>
          ) : (
            <p>Selecciona un proveedor para ver su ticket</p>
          )}
        </div>

        <button onClick={onBack}>Volver al Dashboard</button>
      </div>
    </>
  );
};

export default Dashboard;