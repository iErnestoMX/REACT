import React, { useState, useEffect, useCallback } from 'react';
import '../../Estilos/Inventario.css';

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
      <h2>Inventario de Productos</h2>
      
      <div className="inventario-resumen">
        <div className="resumen-item">
          <h4>Total Productos</h4>
          <p className="resumen-total">{inventario.length}</p>
        </div>
        <div className="resumen-item">
          <h4>Unidades Totales</h4>
          <p className="resumen-unidades">{totalProductos}</p>
        </div>
        <div className="resumen-item">
          <h4>Valor Total</h4>
          <p className="resumen-valor">${totalValorInventario.toFixed(2)}</p>
        </div>
      </div>

      {/* Formulario para agregar productos */}
      <div className="formulario-inventario">
        <h3>Agregar Nuevo Producto</h3>
        <div className="formulario-campos">
          <input 
            type="text" 
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="campo-nombre"
          />
          <input 
            type="number" 
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="campo-precio"
          />
          <input 
            type="number" 
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="campo-cantidad"
          />
          <button 
            onClick={agregarProducto}
            className="btn-agregar"
          >
            ➕ Agregar
          </button>
        </div>
      </div>

      {/* Tabla de inventario */}
      <table className="tabla-inventario">
        <thead>
          <tr className="tabla-header">
            <th>Nombre</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Valor Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventario.length === 0 ? (
            <tr>
              <td colSpan="5" className="tabla-vacia">
                No hay productos en el inventario
              </td>
            </tr>
          ) : (
            inventario.map((prod, i) => (
              <tr key={i} className="fila-producto">
                <td className="celda-nombre">{prod.nombre}</td>
                <td className="celda-precio">${(prod.precio ?? 0).toFixed(2)}</td>
                <td className="celda-cantidad">
                  <span className={`badge-cantidad ${prod.cantidad <= 5 ? 'bajo-stock' : 'stock-normal'}`}>
                    {prod.cantidad} unidades
                  </span>
                </td>
                <td className="celda-valor-total">
                  ${(((prod.precio ?? 0) * prod.cantidad) || 0).toFixed(2)}
                </td>
                <td className="celda-acciones">
                  <button 
                    onClick={() => editarProducto(i)}
                    className="btn-editar"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => eliminarProducto(i)}
                    className="btn-eliminar"
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
        <div className="reiniciar-container">
          <button 
            onClick={reiniciarInventario}
            className="btn-reiniciar"
          >
            🔄 Reiniciar Inventario
          </button>
        </div>
      )}
    </>
  );
};

export default Inventario;