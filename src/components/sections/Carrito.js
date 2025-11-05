import React from 'react';
import { obtenerCarrito, guardarCarrito, obtenerInventario, guardarInventario } from '../../utils/carritoUtils';

const Carrito = ({ onUpdateCarrito }) => {
  const carrito = obtenerCarrito();
  const inventario = obtenerInventario();

  // Función para reintegrar productos al inventario
  const reintegrarAlInventario = (nombreProducto, cantidad) => {
    const inventarioActual = obtenerInventario();
    const productoIndex = inventarioActual.findIndex(item => item.nombre === nombreProducto);
    
    if (productoIndex !== -1) {
      inventarioActual[productoIndex].cantidad += cantidad;
      guardarInventario(inventarioActual);
    }
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    const carritoActual = obtenerCarrito();
    const item = carritoActual[index];
    const diferencia = nuevaCantidad - item.qty;

    if (nuevaCantidad < 1) return;
    
    // Verificar si hay suficiente stock para aumentar la cantidad
    if (diferencia > 0) {
      const productoInventario = inventario.find(prod => prod.nombre === item.name);
      if (productoInventario && productoInventario.cantidad < diferencia) {
        alert(`❌ No hay suficiente stock. Solo hay ${productoInventario.cantidad} unidades disponibles.`);
        return;
      }
    }

    // Actualizar inventario
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

    // Actualizar carrito
    carritoActual[index].qty = nuevaCantidad;
    guardarCarrito(carritoActual);
    onUpdateCarrito();
  };

  const eliminarItem = (index) => {
    const carritoActual = obtenerCarrito();
    const itemEliminado = carritoActual[index];
    
    // Reintegrar al inventario
    reintegrarAlInventario(itemEliminado.name, itemEliminado.qty);
    
    // Eliminar del carrito
    carritoActual.splice(index, 1);
    guardarCarrito(carritoActual);
    onUpdateCarrito();
    
    alert(`✅ ${itemEliminado.name} eliminado del carrito y reintegrado al inventario`);
  };

  const vaciarCarrito = () => {
    // Reintegrar todos los productos al inventario
    carrito.forEach(item => {
      reintegrarAlInventario(item.name, item.qty);
    });
    
    guardarCarrito([]);
    onUpdateCarrito();
    alert('✅ Carrito vaciado y todos los productos reintegrados al inventario');
  };

  const realizarCompra = () => {
    if (carrito.length === 0) {
      alert('❌ El carrito está vacío');
      return;
    }

    // Mostrar resumen de compra
    const total = carrito.reduce((sum, item) => sum + item.price * item.qty, 0);
    const resumen = carrito.map(item => 
      `${item.name} x${item.qty} - $${item.price * item.qty}`
    ).join('\n');

    if (window.confirm(`🛒 RESUMEN DE COMPRA:\n\n${resumen}\n\n💵 TOTAL: $${total}\n\n¿Confirmar compra?`)) {
      // Aquí podrías agregar lógica de pago, por ahora solo vaciamos el carrito
      guardarCarrito([]);
      onUpdateCarrito();
      alert('✅ ¡Compra realizada con éxito! Los productos han sido descontados del inventario.');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const total = carrito.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (carrito.length === 0) {
    return (
      <>
        <header><h2>Carrito</h2></header>
        <div style={{textAlign: 'center', padding: '40px'}}>
          <h3>🛒 Tu carrito está vacío</h3>
          <p>Agrega algunos productos para continuar</p>
        </div>
      </>
    );
  }

  return (
    <>
      <header><h2 style={{textAlign: 'center'}}>🛒 Carrito de compras</h2></header>
      
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: '#e7f3ff', 
        borderRadius: '5px',
        textAlign: 'center'
      }}>
        <strong>💡 Información:</strong> Al eliminar productos del carrito, se reintegran automáticamente al inventario.
      </div>

      <div style={{display: 'flex', justifyContent: 'center'}}>
        <table border="1" style={{textAlign: 'center', width: '90%', maxWidth: '800px'}}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
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
                <tr key={index}>
                  <td style={{padding: '10px'}}>
                    <strong>{item.name}</strong>
                    <br />
                    <small style={{color: '#666'}}>Stock disponible: {stockDisponible}</small>
                  </td>
                  <td style={{padding: '10px'}}>
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '5px'
                      }}
                    />
                  </td>
                  <td style={{padding: '10px'}}>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.qty}
                      onChange={(e) => actualizarCantidad(index, parseInt(e.target.value))}
                      style={{
                        width: '60px',
                        padding: '5px',
                        textAlign: 'center',
                        border: '1px solid #ddd',
                        borderRadius: '3px'
                      }}
                    />
                  </td>
                  <td style={{padding: '10px'}}>${item.price}</td>
                  <td style={{padding: '10px', fontWeight: 'bold'}}>${item.price * item.qty}</td>
                  <td style={{padding: '10px'}}>
                    <button 
                      className="btnEliminar" 
                      onClick={() => eliminarItem(index)}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
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
      
      <div style={{textAlign: 'center', marginTop: '20px'}}>
        <h3>💵 Total general: ${total}</h3>
        
        <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap'}}>
          <button 
            onClick={realizarCompra}
            style={{
              padding: '12px 25px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ✅ Realizar Compra
          </button>
          
          <button 
            onClick={vaciarCarrito}
            style={{
              padding: '12px 25px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🗑️ Vaciar Carrito
          </button>
        </div>
      </div>
    </>
  );
};

export default Carrito;