import React, { useState, useEffect } from 'react';
import { obtenerCarrito, guardarCarrito, obtenerInventario, guardarInventario } from '../../utils/carritoUtils';
import { registrarVenta } from '../../utils/ventasUtils';
import { agregarCliente, buscarClientePorEmail } from '../../utils/clientesUtils';
import { notificacionExito, notificacionError, notificacionInfo } from '../../utils/notificacionesUtils';
import '../../Estilos/Carrito.css';

const Carrito = ({ onUpdateCarrito }) => {
  const [carrito, setCarrito] = useState([]);
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    const sincronizarDatos = () => {
      const carritoActual = obtenerCarrito();
      const inventarioActual = obtenerInventario();
      
   
      const carritoActualizado = carritoActual.map(item => {
        const productoInventario = inventarioActual.find(prod => prod.nombre === item.name);
        if (productoInventario && productoInventario.precio !== item.price) {
          return {
            ...item,
            price: productoInventario.precio
          };
        }
        return item;
      });
      
      if (JSON.stringify(carritoActualizado) !== JSON.stringify(carritoActual)) {
        guardarCarrito(carritoActualizado);
      }
      
      setCarrito(carritoActualizado);
      setInventario(inventarioActual);
    };

    sincronizarDatos();

    window.addEventListener('storage', sincronizarDatos);

    const interval = setInterval(sincronizarDatos, 1000);
    
    return () => {
      window.removeEventListener('storage', sincronizarDatos);
      clearInterval(interval);
    };
  }, []);

  const reintegrarAlInventario = (nombreProducto, cantidad) => {
    const inventarioActual = obtenerInventario();
    const productoIndex = inventarioActual.findIndex(item => item.nombre === nombreProducto);
    
    if (productoIndex !== -1) {
      inventarioActual[productoIndex].cantidad += cantidad;
      guardarInventario(inventarioActual);
      setInventario(inventarioActual);
    }
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    const carritoActual = obtenerCarrito();
    const item = carritoActual[index];
    const diferencia = nuevaCantidad - item.qty;

    if (nuevaCantidad < 1) return;
    
    if (diferencia > 0) {
      const productoInventario = inventario.find(prod => prod.nombre === item.name);
      if (productoInventario && productoInventario.cantidad < diferencia) {
        notificacionError(
          'Stock Insuficiente', 
          `Solo hay ${productoInventario.cantidad} unidades disponibles`
        );
        return;
      }
    }

    const inventarioActual = inventario.map(prod => {
      if (prod.nombre === item.name) {
        return {
          ...prod,
          cantidad: prod.cantidad - diferencia
        };
      }
      return prod;
    });
    
    guardarInventario(inventarioActual);
    setInventario(inventarioActual);
    
    carritoActual[index].qty = nuevaCantidad;
    guardarCarrito(carritoActual);
    setCarrito(carritoActual);
    
    onUpdateCarrito();
    window.dispatchEvent(new Event('storage'));
  };

  const eliminarItem = (index) => {
    const carritoActual = obtenerCarrito();
    const itemEliminado = carritoActual[index];
    
    // Reintegrar al inventario
    reintegrarAlInventario(itemEliminado.name, itemEliminado.qty);
    
   
    carritoActual.splice(index, 1);
    guardarCarrito(carritoActual);
    setCarrito(carritoActual);
    
    onUpdateCarrito();
    window.dispatchEvent(new Event('storage'));
    
    notificacionExito('Producto Eliminado', `${itemEliminado.name} eliminado del carrito`);
  };

  const vaciarCarrito = () => {

    carrito.forEach(item => {
      reintegrarAlInventario(item.name, item.qty);
    });
    
    guardarCarrito([]);
    setCarrito([]);
    onUpdateCarrito();
    window.dispatchEvent(new Event('storage'));
    
    notificacionInfo('Carrito Vaciado', 'Todos los productos reintegrados al inventario');
  };

  const realizarCompra = () => {
    if (carrito.length === 0) {
      notificacionError('Carrito Vacío', 'Agrega productos antes de realizar la compra');
      return;
    }

    const total = carrito.reduce((sum, item) => sum + item.price * item.qty, 0);
    const resumen = carrito.map(item => 
      `${item.name} x${item.qty} - $${item.price * item.qty}`
    ).join('\n');

    const clienteEmail = prompt('📧 Ingrese el email del cliente:');
    if (!clienteEmail) {
      notificacionError('Email Requerido', 'Se requiere email del cliente para registrar la venta');
      return;
    }

    if (!clienteEmail.includes('@') || !clienteEmail.includes('.')) {
      notificacionError('Email Inválido', 'Por favor ingrese un email válido');
      return;
    }

    const clienteNombre = prompt('👤 Ingrese el nombre del cliente:') || 'Cliente';
    const clienteTelefono = prompt('📞 Ingrese el teléfono del cliente (opcional):') || '';

    if (window.confirm(`🛒 RESUMEN DE COMPRA:\n\n👤 Cliente: ${clienteNombre}\n📧 Email: ${clienteEmail}\n\n${resumen}\n\n💵 TOTAL: $${total}\n\n¿Confirmar compra?`)) {
      
      try {
    
        let cliente = buscarClientePorEmail(clienteEmail);
        if (!cliente) {
          cliente = agregarCliente({
            nombre: clienteNombre,
            email: clienteEmail,
            telefono: clienteTelefono
          });
        }


        const venta = registrarVenta({
          cliente: clienteNombre,
          clienteEmail: clienteEmail,
          clienteTelefono: clienteTelefono,
          productos: carrito.map(item => ({
            nombre: item.name,
            cantidad: item.qty,
            precio: item.price,
            total: item.price * item.qty
          })),
          total: total,
          items: carrito.length
        });

        guardarCarrito([]);
        setCarrito([]);
        onUpdateCarrito();
        window.dispatchEvent(new Event('storage'));
        
        notificacionExito(
          '¡Compra Exitosa!', 
          `Venta #${venta.id.slice(-6)} registrada\nCliente: ${clienteNombre}\nTotal: $${total}`
        );
        
      } catch (error) {
        notificacionError('Error en Compra', 'Por favor intente nuevamente');
        console.error('Error en realizarCompra:', error);
      }
    }
  };

  const total = carrito.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (carrito.length === 0) {
    return (
      <>
        <h2>Carrito</h2>
        <div className="carrito-vacio">
          <h3>🛒 Tu carrito está vacío</h3>
          <p>Agrega algunos productos para continuar</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="carrito-title">Carrito de compras</h2>

      <div className="carrito-container">
        <table className="carrito-table">
          <thead>
            <tr className="carrito-header">
              <th>Artículo</th>
              <th>Imagen</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item, index) => {
              const productoInventario = inventario.find(prod => prod.nombre === item.name);
              const stockDisponible = productoInventario ? productoInventario.cantidad : 0;

              return (
                <tr key={index} className="carrito-row">
                  <td className="carrito-item-info">
                    <strong>{item.name}</strong>
                    <br />
                    <small className="stock-info">Stock disponible: {stockDisponible}</small>
                  </td>
                  <td className="carrito-item-image">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="product-image"
                    />
                  </td>
                  <td className="carrito-item-cantidad">
                    <input 
                      type="number" 
                      min="1" 
                      value={item.qty}
                      onChange={(e) => actualizarCantidad(index, parseInt(e.target.value))}
                      className="cantidad-input"
                    />
                  </td>
                  <td className="carrito-item-precio">${item.price}</td>
                  <td className="carrito-item-total">${item.price * item.qty}</td>
                  <td className="carrito-item-acciones">
                    <button 
                      onClick={() => eliminarItem(index)}
                      className="btn-eliminar"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="carrito-resumen">
        <h3 className="total-general">💵 Total general: ${total}</h3>
        
        <div className="nota-info">
          <strong>📝 Nota:</strong> Al realizar la compra se solicitará tus datos como gmail, nombre y telefono 
        </div>
        
        <div className="carrito-botones">
          <button 
            onClick={realizarCompra}
            className="btn-comprar"
          >
            ✅ Realizar Compra
          </button>
          
          <button 
            onClick={vaciarCarrito}
            className="btn-vaciar"
          >
            🗑️ Vaciar Carrito
          </button>
        </div>
      </div>
    </>
  );
};

export default Carrito;