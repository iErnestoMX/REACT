// components/sections/RegistroVentas.js
import React, { useState, useEffect } from 'react';
import { obtenerVentas, obtenerVentasPorCliente, obtenerTotalVentas, obtenerVentasDelDia } from '../../utils/ventasUtils';
import { obtenerClientes } from '../../utils/clientesUtils';

const RegistroVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setVentas(obtenerVentas());
    setClientes(obtenerClientes());
  };

  const filtrarVentas = () => {
    let ventasFiltradas = obtenerVentas();

    if (filtroCliente) {
      ventasFiltradas = obtenerVentasPorCliente(filtroCliente);
    }

    if (fechaInicio) {
      ventasFiltradas = ventasFiltradas.filter(venta => 
        new Date(venta.fecha) >= new Date(fechaInicio)
      );
    }

    if (fechaFin) {
      ventasFiltradas = ventasFiltradas.filter(venta => 
        new Date(venta.fecha) <= new Date(fechaFin + 'T23:59:59')
      );
    }

    setVentas(ventasFiltradas);
  };

  const limpiarFiltros = () => {
    setFiltroCliente('');
    setFechaInicio('');
    setFechaFin('');
    cargarDatos();
  };

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ventasDelDia = obtenerVentasDelDia();
  const totalGeneral = obtenerTotalVentas();
  const totalFiltrado = ventas.reduce((sum, venta) => sum + venta.total, 0);

  return (
    <>
     
        <h2>Registro de Ventas</h2>
      

      {/* Estadísticas rápidas */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          minWidth: '200px'
        }}>
          <h3>💰 Total General</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
            ${totalGeneral.toFixed(2)}
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb, #f5576c)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          minWidth: '200px'
        }}>
          <h3>📅 Ventas Hoy</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
            {ventasDelDia.length}
          </p>
          <p>${ventasDelDia.reduce((sum, v) => sum + v.total, 0).toFixed(2)}</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          minWidth: '200px'
        }}>
          <h3>👥 Total Clientes</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
            {clientes.length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3>🔍 Filtros</h3>
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          alignItems: 'end'
        }}>
          <div>
            <label>Cliente:</label>
            <select 
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginLeft: '10px'
              }}
            >
              <option value="">Todos los clientes</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.nombre}>
                  {cliente.nombre} ({cliente.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Desde:</label>
            <input 
              type="date" 
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginLeft: '10px'
              }}
            />
          </div>

          <div>
            <label>Hasta:</label>
            <input 
              type="date" 
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginLeft: '10px'
              }}
            />
          </div>

          <button 
            onClick={filtrarVentas}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔍 Aplicar Filtros
          </button>

          <button 
            onClick={limpiarFiltros}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🗑️ Limpiar
          </button>
        </div>

        {ventas.length > 0 && (
          <div style={{ marginTop: '15px', fontWeight: 'bold' }}>
            📈 Total filtrado: ${totalFiltrado.toFixed(2)} ({ventas.length} ventas)
          </div>
        )}
      </div>

      {/* Lista de ventas */}
      <div>
        <h3>📋 Historial de Ventas</h3>
        
        {ventas.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <p>No hay ventas registradas</p>
          </div>
        ) : (
          <div style={{
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {ventas.map((venta) => (
              <div 
                key={venta.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '10px'
                }}>
                  <div>
                    <strong>🆔 Venta #{venta.id.slice(-6)}</strong>
                    <br />
                    <small>📅 {formatearFecha(venta.fecha)}</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '18px', color: '#28a745' }}>
                      ${venta.total.toFixed(2)}
                    </strong>
                    <br />
                    <small>{venta.items} productos</small>
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <strong>👤 Cliente:</strong> {venta.cliente}
                  <br />
                  <strong>📧 Email:</strong> {venta.clienteEmail}
                </div>

                <div>
                  <strong>🛍️ Productos:</strong>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {venta.productos.map((producto, index) => (
                      <li key={index}>
                        {producto.nombre} x{producto.cantidad} - ${producto.total.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RegistroVentas;