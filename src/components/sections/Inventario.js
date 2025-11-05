import React, { useState, useEffect, useCallback } from 'react';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  const obtenerInventario = () => {
    return JSON.parse(localStorage.getItem("inventario")) || [];
  };

  const guardarInventario = (inv) => {
    localStorage.setItem("inventario", JSON.stringify(inv));
  };

  const mostrarInventario = useCallback(() => {
    const inventarioActual = obtenerInventario();
    setInventario(inventarioActual);
  }, []);

  useEffect(() => {
    mostrarInventario();
    
    // Escuchar cambios en el inventario
    const handleStorageChange = () => {
      mostrarInventario();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [mostrarInventario]);

  const agregarProducto = () => {
    const nombreTrim = nombre.trim();
    const precioNum = parseFloat(precio);
    const cantidadNum = parseInt(cantidad);

    if (!nombreTrim || isNaN(precioNum) || isNaN(cantidadNum)) {
      alert("Por favor completa todos los campos correctamente.");
      return;
    }

    if (precioNum < 0 || cantidadNum < 0) {
      alert("El precio y la cantidad deben ser números positivos.");
      return;
    }

    const inventarioActual = obtenerInventario();
    const existente = inventarioActual.find(p => p.nombre === nombreTrim);
    
    if (existente) {
      existente.cantidad += cantidadNum;
      existente.precio = precioNum;
    } else {
      inventarioActual.push({ 
        nombre: nombreTrim, 
        precio: precioNum, 
        cantidad: cantidadNum 
      });
    }

    guardarInventario(inventarioActual);
    mostrarInventario();

    // Limpiar campos
    setNombre('');
    setPrecio('');
    setCantidad('');

    alert(`✅ Producto "${nombreTrim}" agregado al inventario`);
  };

  const editarProducto = (i) => {
    const producto = inventario[i];
    const nuevaCantidad = prompt(`Nueva cantidad para "${producto.nombre}":`, producto.cantidad);
    if (nuevaCantidad === null) return;
    
    const cantidadNum = parseInt(nuevaCantidad);
    if (isNaN(cantidadNum) || cantidadNum < 0) {
      alert("Cantidad no válida.");
      return;
    }

    const inventarioActual = obtenerInventario();
    inventarioActual[i].cantidad = cantidadNum;
    guardarInventario(inventarioActual);
    mostrarInventario();
    
    alert(`✅ Cantidad de "${producto.nombre}" actualizada a ${cantidadNum}`);
  };

  const eliminarProducto = (i) => {
    const producto = inventario[i];
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}" del inventario?`)) {
      const inventarioActual = obtenerInventario();
      inventarioActual.splice(i, 1);
      guardarInventario(inventarioActual);
      mostrarInventario();
      
      alert(`✅ Producto "${producto.nombre}" eliminado del inventario`);
    }
  };

  const reiniciarInventario = () => {
    if (window.confirm("¿Estás seguro de que quieres reiniciar todo el inventario? Se perderán todos los datos.")) {
      localStorage.removeItem("inventario");
      mostrarInventario();
      alert("✅ Inventario reiniciado");
    }
  };

  const totalValorInventario = inventario.reduce((sum, prod) => sum + (prod.precio * prod.cantidad), 0);
  const totalProductos = inventario.reduce((sum, prod) => sum + prod.cantidad, 0);

  return (
    <>
      <header><h2>Inventario de Productos</h2></header>

      {/* Resumen del inventario */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{textAlign: 'center'}}>
          <h4 style={{margin: '0', color: '#666'}}>Total Productos</h4>
          <p style={{fontSize: '24px', fontWeight: 'bold', color: '#007bff', margin: '5px 0'}}>
            {inventario.length}
          </p>
        </div>
        <div style={{textAlign: 'center'}}>
          <h4 style={{margin: '0', color: '#666'}}>Unidades Totales</h4>
          <p style={{fontSize: '24px', fontWeight: 'bold', color: '#28a745', margin: '5px 0'}}>
            {totalProductos}
          </p>
        </div>
        <div style={{textAlign: 'center'}}>
          <h4 style={{margin: '0', color: '#666'}}>Valor Total</h4>
          <p style={{fontSize: '24px', fontWeight: 'bold', color: '#ffc107', margin: '5px 0'}}>
            ${totalValorInventario.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Formulario para agregar productos */}
      <div style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        marginBottom: '20px'
      }}>
        <h3>Agregar Nuevo Producto</h3>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
          <input 
            type="text" 
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: '1', minWidth: '150px'}}
          />
          <input 
            type="number" 
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px'}}
          />
          <input 
            type="number" 
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px'}}
          />
          <button 
            onClick={agregarProducto}
            style={{
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ➕ Agregar
          </button>
        </div>
      </div>

      {/* Tabla de inventario */}
      <table border="1" width="100%" style={{ 
        marginTop: '20px', 
        borderCollapse: 'collapse',
        backgroundColor: 'white'
      }}>
        <thead>
          <tr style={{backgroundColor: '#343a40', color: 'white'}}>
            <th style={{padding: '12px'}}>Nombre</th>
            <th style={{padding: '12px'}}>Precio Unitario</th>
            <th style={{padding: '12px'}}>Cantidad</th>
            <th style={{padding: '12px'}}>Valor Total</th>
            <th style={{padding: '12px'}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventario.length === 0 ? (
            <tr>
              <td colSpan="5" style={{padding: '20px', textAlign: 'center', color: '#666'}}>
                No hay productos en el inventario
              </td>
            </tr>
          ) : (
            inventario.map((prod, i) => (
              <tr key={i} style={{borderBottom: '1px solid #ddd'}}>
                <td style={{padding: '12px', fontWeight: 'bold'}}>{prod.nombre}</td>
                <td style={{padding: '12px'}}>${(prod.precio ?? 0).toFixed(2)}</td>
                <td style={{padding: '12px'}}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: prod.cantidad <= 5 ? '#ff6b6b' : '#51cf66',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {prod.cantidad} unidades
                  </span>
                </td>
                <td style={{padding: '12px', fontWeight: 'bold'}}>
                  ${(((prod.precio ?? 0) * prod.cantidad) || 0).toFixed(2)}
                </td>
                <td style={{padding: '12px'}}>
                  <button 
                    onClick={() => editarProducto(i)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => eliminarProducto(i)}
                    style={{
                      padding: '6px 12px',
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
            ))
          )}
        </tbody>
      </table>

      {/* Botón para reiniciar inventario */}
      {inventario.length > 0 && (
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button 
            onClick={reiniciarInventario}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Reiniciar Inventario
          </button>
        </div>
      )}
    </>
  );
};

export default Inventario;