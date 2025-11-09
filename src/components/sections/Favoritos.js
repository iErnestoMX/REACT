// src/components/sections/Favoritos.js
import React, { useState, useEffect } from 'react';
import { obtenerFavoritos, eliminarDeFavoritos } from '../../utils/favoritosUtils';
import { obtenerCarrito, guardarCarrito, obtenerInventario, guardarInventario } from '../../utils/carritoUtils';
import { notificacionExito, notificacionError, notificacionCarrito, notificacionInfo } from '../../utils/notificacionesUtils';

const Favoritos = ({ onUpdateFavoritos }) => {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const actualizarFavoritos = () => {
      setFavoritos(obtenerFavoritos());
    };

    // Cargar favoritos iniciales
    actualizarFavoritos();

    // Escuchar eventos de actualización
    window.addEventListener('favoritosActualizados', actualizarFavoritos);
    
    return () => {
      window.removeEventListener('favoritosActualizados', actualizarFavoritos);
    };
  }, []);

  const eliminarFavorito = (nombreProducto) => {
    eliminarDeFavoritos(nombreProducto);
    onUpdateFavoritos?.();
    notificacionExito('Favorito Eliminado', `${nombreProducto} eliminado de favoritos`);
  };

  const agregarAlCarrito = (producto) => {
    const carrito = obtenerCarrito();
    const inventario = obtenerInventario();
    
    // Verificar stock
    const productoInventario = inventario.find(prod => prod.nombre === producto.nombre);
    if (!productoInventario || productoInventario.cantidad < 1) {
      notificacionError('Sin Stock', `No hay stock disponible de ${producto.nombre}`);
      return;
    }

    // Verificar si ya está en el carrito
    const itemExistente = carrito.find(item => item.name === producto.nombre);
    
    if (itemExistente) {
      // Si ya existe, aumentar cantidad si hay stock
      if (productoInventario.cantidad > itemExistente.qty) {
        itemExistente.qty += 1;
      } else {
        notificacionError(
          'Stock Insuficiente', 
          `Solo hay ${productoInventario.cantidad} unidades disponibles de ${producto.nombre}`
        );
        return;
      }
    } else {
      // Si no existe, agregar nuevo item
      carrito.push({
        name: producto.nombre,
        qty: 1,
        price: producto.price,
        img: producto.img
      });
    }

    // Actualizar inventario
    const inventarioActualizado = inventario.map(prod => 
      prod.nombre === producto.nombre 
        ? { ...prod, cantidad: prod.cantidad - 1 }
        : prod
    );

    guardarInventario(inventarioActualizado);
    guardarCarrito(carrito);
    
    // Disparar eventos para actualizar otros componentes
    window.dispatchEvent(new Event('storage'));
    onUpdateFavoritos?.();
    
    notificacionCarrito(
      'Producto Agregado', 
      `${producto.nombre} agregado al carrito\nStock restante: ${productoInventario.cantidad - 1}`
    );
  };

  const vaciarFavoritos = () => {
    localStorage.setItem('favoritos', JSON.stringify([]));
    setFavoritos([]);
    onUpdateFavoritos?.();
    notificacionInfo('Lista Vacía', 'Todos los favoritos han sido eliminados');
  };

  if (favoritos.length === 0) {
    return (
      <>
        <h2>Favoritos</h2>
        <div style={{textAlign: 'center', padding: '40px'}}>
          <h3>Tu lista de favoritos está vacía</h3>
          <p>Agrega productos a favoritos para verlos aquí</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 20px'
      }}>
        <h2 style={{margin: 0}}>Favoritos ({favoritos.length})</h2>
        <button 
          onClick={vaciarFavoritos}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🗑️ Vaciar Lista
        </button>
      </div>

      {/* Contenedor horizontal con scroll */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '20px',
        padding: '20px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#007bff #f1f1f1',
        minHeight: '320px'
      }}>
        {favoritos.map((item, index) => {
          const inventario = obtenerInventario();
          const productoInventario = inventario.find(prod => prod.nombre === item.nombre);
          const stockDisponible = productoInventario ? productoInventario.cantidad : 0;
          const sinStock = stockDisponible <= 0;

          return (
            <div 
              key={index}
              style={{
                border: `2px solid ${sinStock ? '#ff6b6b' : '#e0e0e0'}`,
                borderRadius: '12px',
                padding: '15px',
                backgroundColor: sinStock ? '#fff5f5' : '#ffffff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                width: '250px',
                minWidth: '250px', // Ancho fijo para cada tarjeta
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                flexShrink: 0 // Evita que las tarjetas se reduzcan
              }}
            >
              <img 
                src={item.img} 
                alt={item.nombre} 
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              
              <h3 style={{
                margin: '0', 
                textAlign: 'center',
                fontSize: '16px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.nombre}
              </h3>
              
              <p style={{
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#007bff', 
                textAlign: 'center', 
                margin: '0'
              }}>
                ${item.price}
              </p>
              
              <div style={{
                padding: '5px 10px',
                backgroundColor: sinStock ? '#ff6b6b' : 
                               stockDisponible <= 5 ? '#ffa94d' : '#51cf66',
                color: 'white',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {sinStock ? '❌ SIN STOCK' : 
                 stockDisponible <= 5 ? `⚠️ Últimas ${stockDisponible}` : 
                 `📦 Stock: ${stockDisponible}`}
              </div>

              <div style={{
                display: 'flex', 
                gap: '8px',
                marginTop: 'auto'
              }}>
                <button 
                  onClick={() => agregarAlCarrito(item)}
                  disabled={sinStock}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: sinStock ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: sinStock ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {sinStock ? '❌ Agotado' : '🛒 Carrito'}
                </button>
                
                <button 
                  onClick={() => eliminarFavorito(item.nombre)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="Eliminar de favoritos"
                >
                  ❌
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estilos para la scrollbar */}
      <style>
        {`
          div::-webkit-scrollbar {
            height: 8px;
          }
          
          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          div::-webkit-scrollbar-thumb {
            background: #007bff;
            border-radius: 10px;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: #0056b3;
          }
        `}
      </style>
    </>
  );
};

export default Favoritos;