import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { obtenerCarrito, guardarCarrito } from '../../utils/carritoUtils';
import { agregarAFavoritos, eliminarDeFavoritos, estaEnFavoritos } from '../../utils/favoritosUtils';
import { notificacionCarrito, notificacionFavorito, notificacionError } from '../../utils/notificacionesUtils';


const Articulos = ({ onUpdateCarrito }) => {
  const [articulos, setArticulos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [indiceInicio, setIndiceInicio] = useState(0);
  const [favoritos, setFavoritos] = useState({});
  const [imagenesActuales, setImagenesActuales] = useState({});
  

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [soloEnStock, setSoloEnStock] = useState(false);
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const articulosContainerRef = useRef(null);
  const ARTICULOS_POR_FILA = 4;


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
    ],
    "Pincel": [
      "https://i.postimg.cc/5tvCJSb1/Pincel.png",
      "https://i.postimg.cc/XqdtZRYK/best-artist-paint-brushes-2-removebg-preview.png",
      "https://i.postimg.cc/ZKP1Jzgx/pinceles-removebg-preview.png"
    ],
    "Esferas Navideñas": [
      "https://i.postimg.cc/JzVYmPW1/214620-d.jpg",
      "https://resources.sanborns.com.mx/medios-plazavip/t1/1734401243DNQNP976451MLM79985864992102024Ojpg?scale=50&qlty=75",
      "https://http2.mlstatic.com/D_NQ_NP_769807-MLU74023754004_012024-O.webp"
    ],
    "Luces LED": [
      "https://i.postimg.cc/d0H4YgpH/Imagen-Lucez.jpg",
      "https://m.media-amazon.com/images/I/91A3owIWeyL._AC_UF894,1000_QL80_.jpg",
      "https://lamercedimportadora.mx/wp-content/uploads/2024/09/L564016-04.jpg"
    ],
    "Arbol de Navidad": [
      "https://i.postimg.cc/s2tv0QhT/813arlp-Ns-SL.jpg",
      "https://houzerstore.com.mx/cdn/shop/files/MKZ-ARBM3-190V.jpg?v=1750438853",
      "https://www.costco.com.mx/medias/sys_master/products/h56/hd9/360893566124062.jpg"
    ],
    "Corona Navidad": [
      "https://i.postimg.cc/kMygWhT5/71Nf-URFBXAL-AC-UF894-1000-QL80.jpg",
      "https://i.etsystatic.com/13909799/r/il/d618b1/5561736651/il_570xN.5561736651_f4t9.jpg",
      "https://waldos.com.mx/cdn/shop/files/100092988COMBI_1.jpg?v=1699039359&width=1214"
    ],
    "Bolsa Navideña": [
      "https://i.postimg.cc/59LBr4Y6/descarga-removebg-preview.png",
      "https://waldos.com.mx/cdn/shop/files/100092411BSANTA--_2.jpg?v=1697211578",
      "https://img.kwcdn.com/product/fancy/3521b422-37c5-401b-9b7c-60df58d8d479.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"
    ],
    "Papel Navideño": [
      "https://i.postimg.cc/LXf1GDsQ/papel-navideno-beumont-couche-70x100cm-9438hr-sku-349031.jpg",
      "https://m.media-amazon.com/images/I/71VAmcVcXdL.jpg",
      "https://media.istockphoto.com/id/1430709087/es/vector/fondo-rojo-de-garabatos-navide%C3%B1os-adecuado-para-el-dise%C3%B1o-de-envases-papel-tapiz-o-como.jpg?s=612x612&w=0&k=20&c=CZetA8hSFHSf1I0GOxYqq6owSFgiKtTTt446JQIKFgQ="
    ]
    
  };

  useEffect(() => {
    const articulosData = [
      { nombre: "Colores", price: 95, img: "https://i.postimg.cc/QMYctmWy/Colores.png", desc: "Pigmentos vivos, punta resistente y trazos uniformes.", categoria: "material-artistico" },
      { nombre: "Cuadernos", price: 28, img: "https://i.postimg.cc/Df4GgC62/Cuaderno-Jean-Book.png", desc: "Pasta dura, diseño moderno y hojas cuadriculadas.", categoria: "cuadernos" },
      { nombre: "Lápices Adhesivos", price: 18, img: "https://i.postimg.cc/ncs3qYjz/Pegamento-Dixon.png", desc: "Ideal para pegar papel, cartón y fotos sin ensuciar.", categoria: "adhesivos" },
      { nombre: "Lápices", price: 5, img: "https://i.postimg.cc/YCPGYYFr/01280115-removebg-preview.png", desc: "Punta resistente y madera ecológica para trazos suaves.", categoria: "escritura" },
      { nombre: "Plumas", price: 10, img: "https://i.postimg.cc/fbMF7SQH/Plumas-Paper.png", desc: "Escritura fluida, colores intensos y gran durabilidad.", categoria: "escritura" },
      { nombre: "Engrapadoras", price: 25, img: "https://i.postimg.cc/447VqLSW/Engrapadora-removebg-preview.png", desc: "Diseño ergonómico para un engrape fácil.", categoria: "oficina" },
      { nombre: "Hojas de carpeta", price: 50, img: "https://i.postimg.cc/wjtCmdfx/Hojas-de-carpeta.png", desc: "Papel de alta calidad para archivar documentos.", categoria: "papel" },
      { nombre: "Plastilina", price: 18, img: "https://i.postimg.cc/3wTtxMPQ/Plastilina.png", desc: "Colores vibrantes y textura suave.", categoria: "material-artistico" },
      { nombre: "Pegamento blanco", price: 25, img: "https://i.postimg.cc/JzWNbNK0/Pegamento-Blanco.png", desc: "Adhesivo fuerte y de secado rápido.", categoria: "adhesivos" },
      { nombre: "Pincel", price: 15, img: "https://i.postimg.cc/5tvCJSb1/Pincel.png", desc: "El mejor material de pinceles.", categoria: "escritura" },
      { nombre: "Esferas Navideñas", price: 50, img: "https://i.postimg.cc/JzVYmPW1/214620-d.jpg", desc: "El mejor material de pinceles.", categoria: "material-artistico" },
      { nombre: "Luces LED", price: 110, img: "https://i.postimg.cc/d0H4YgpH/Imagen-Lucez.jpg", desc: "El mejor material de pinceles.", categoria: "material-artistico" },
      { nombre: "Arbol de Navidad", price: 800, img: "https://i.postimg.cc/s2tv0QhT/813arlp-Ns-SL.jpg", desc: "El mejor material de pinceles.", categoria: "material-artistico" },
      { nombre: "Corona Navidad", price: 120, img: "https://i.postimg.cc/kMygWhT5/71Nf-URFBXAL-AC-UF894-1000-QL80.jpg", desc: "El mejor material de pinceles.", categoria: "material-artistico" },
      { nombre: "Bolsa Navideña", price: 20, img: "https://i.postimg.cc/59LBr4Y6/descarga-removebg-preview.png", desc: "El mejor material de pinceles.", categoria: "papel" },
      { nombre: "Papel Navideño", price: 15, img: "https://i.postimg.cc/LXf1GDsQ/papel-navideno-beumont-couche-70x100cm-9438hr-sku-349031.jpg", desc: "El mejor material de pinceles.", categoria: "papel" }
      
    ];
    setArticulos(articulosData);
    localStorage.setItem("articulos", JSON.stringify(articulosData));

    const imagenesIniciales = {};
    articulosData.forEach(articulo => {
      imagenesIniciales[articulo.nombre] = 0;
    });
    setImagenesActuales(imagenesIniciales);

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

    const favoritosEstado = {};
    articulosData.forEach(articulo => {
      favoritosEstado[articulo.nombre] = estaEnFavoritos(articulo.nombre);
    });
    setFavoritos(favoritosEstado);
  }, []);

  const obtenerCantidadDisponible = useCallback((nombreArticulo) => {
    const producto = inventario.find(item => item.nombre === nombreArticulo);
    return producto ? producto.cantidad : 0;
  }, [inventario]);

  const articulosFiltrados = useMemo(() => {
    let filtrados = articulos.filter(articulo => {
      const coincideBusqueda = 
        articulo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        articulo.desc.toLowerCase().includes(busqueda.toLowerCase());
      
      const coincideCategoria = 
        categoria === 'todos' || articulo.categoria === categoria;
      
      const enStock = obtenerCantidadDisponible(articulo.nombre) > 0;
      const coincideStock = !soloEnStock || enStock;
      
      const esFavorito = favoritos[articulo.nombre];
      const coincideFavoritos = !soloFavoritos || esFavorito;

      return coincideBusqueda && coincideCategoria && coincideStock && coincideFavoritos;
    });

    return filtrados;
  }, [articulos, busqueda, categoria, soloEnStock, soloFavoritos, favoritos, obtenerCantidadDisponible]);




  
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
        }, 2500);
      }
    });

    return () => {
      Object.values(intervalos).forEach(interval => clearInterval(interval));
    };
  }, [articulos]);

  const toggleFavorito = (articulo) => {
    if (favoritos[articulo.nombre]) {
      eliminarDeFavoritos(articulo.nombre);
      setFavoritos(prev => ({
        ...prev,
        [articulo.nombre]: false
      }));
      notificacionFavorito('Favorito Eliminado', `${articulo.nombre} eliminado de favoritos`);
    } else {
      const agregado = agregarAFavoritos(articulo);
      if (agregado) {
        setFavoritos(prev => ({
          ...prev,
          [articulo.nombre]: true
        }));
        notificacionFavorito('¡Agregado a Favoritos!', `${articulo.nombre} agregado a tus favoritos`);
      }
    }
  };

  const agregarAlCarrito = (articulo) => {
    const cantidadDisponible = obtenerCantidadDisponible(articulo.nombre);
    
    if (cantidadDisponible <= 0) {
      notificacionError('Producto Agotado', `No hay stock disponible de ${articulo.nombre}`);
      return;
    }

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
    notificacionCarrito(
      'Producto Agregado', 
      `${articulo.nombre} agregado al carrito\nStock restante: ${cantidadDisponible - 1}`
    );
    onUpdateCarrito();
    window.dispatchEvent(new Event('storage'));
  };

  const siguiente = () => {
    if (indiceInicio + ARTICULOS_POR_FILA < articulosFiltrados.length) {
      setIndiceInicio(indiceInicio + 1);
    }
  };

  const anterior = () => {
    if (indiceInicio > 0) {
      setIndiceInicio(indiceInicio - 1);
    }
  };

  const articulosVisibles = articulosFiltrados.slice(indiceInicio, indiceInicio + ARTICULOS_POR_FILA);

  const categorias = useMemo(() => {
    const cats = articulos.map(a => a.categoria);
    return ['todos', ...new Set(cats)];
  }, [articulos]);

  return (
    <>
      <h2>Artículos</h2>
      <p>Se muestran imágenes de los <strong>artículos en venta</strong> y <em>su costo</em>, de la <abbr title="Papelería Karen">PapeKaren</abbr></p>

      <div style={{
        background: 'linear-gradient(135deg, #fff7ea, #ffffff)',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        border: '1px dashed #ffd6a5'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>

          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 8px',
                paddingLeft: '0px',
                border: '2px solid #d2b48c',
                borderRadius: '20px',
                fontSize: '14px',
                fontFamily: 'Quicksand, sans-serif',
                background: 'white'
              }}
            />
          </div>

  
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '2px solid #d2b48c',
              borderRadius: '20px',
              background: 'white',
              fontFamily: 'Quicksand, sans-serif',
              fontSize: '14px',
              minWidth: '140px'
            }}
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'todos' ? 'Todas' : 
                 cat === 'material-artistico' ? 'Arte' :
                 cat === 'escritura' ? 'Escritura' :
                 cat === 'oficina' ? 'Oficina' :
                 cat === 'adhesivos' ? 'Adhesivos' :
                 cat === 'papel' ? 'Papel' :
                 cat === 'cuadernos' ? 'Cuadernos' : cat}
              </option>
            ))}
          </select>

  
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Quicksand, sans-serif',
              whiteSpace: 'nowrap'
            }}>
              <input
                type="checkbox"
                checked={soloEnStock}
                onChange={(e) => setSoloEnStock(e.target.checked)}
                style={{ transform: 'scale(1.1)' }}
              />
              📦 En stock
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Quicksand, sans-serif',
              whiteSpace: 'nowrap'
            }}>
              <input
                type="checkbox"
                checked={soloFavoritos}
                onChange={(e) => setSoloFavoritos(e.target.checked)}
                style={{ transform: 'scale(1.1)' }}
              />
              ⭐ Favoritos
            </label>
          </div>

          <button
            onClick={() => {
              setBusqueda('');
              setCategoria('todos');
              setSoloEnStock(false);
              setSoloFavoritos(false);
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'Quicksand, sans-serif',
              whiteSpace: 'nowrap'
            }}
          >
            🗑️ Limpiar
          </button>

      
          <div style={{
            fontSize: '14px',
            color: '#666',
            fontFamily: 'Quicksand, sans-serif',
            background: '#f8f9fa',
            padding: '6px 12px',
            borderRadius: '15px',
            whiteSpace: 'nowrap'
          }}>
            {articulosFiltrados.length} productos
          </div>
        </div>
      </div>

    
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
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
            fontSize: '16px',
            width: '45px',
            height: '45px',
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
          textAlign: 'center',
          fontFamily: 'Quicksand, sans-serif'
        }}>
          Mostrando {indiceInicio + 1}-{Math.min(indiceInicio + ARTICULOS_POR_FILA, articulosFiltrados.length)} de {articulosFiltrados.length} artículos
        </div>

        <button 
          onClick={siguiente}
          disabled={indiceInicio + ARTICULOS_POR_FILA >= articulosFiltrados.length}
          style={{
            padding: '10px 15px',
            backgroundColor: indiceInicio + ARTICULOS_POR_FILA >= articulosFiltrados.length ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: indiceInicio + ARTICULOS_POR_FILA >= articulosFiltrados.length ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ▶
        </button>
      </div>

      {articulosFiltrados.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #ddd',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#666', marginBottom: '10px', fontSize: '18px' }}>No se encontraron productos</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>Intenta con otros términos de búsqueda o ajusta los filtros</p>
        </div>
      )}

     
      {articulosFiltrados.length > 0 && (
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
                    fontSize: '16px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 10
                  }}
                  title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  {esFavorito ? '⭐' : '☆'}
                </button>

                
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
                      objectFit: 'cover'
                    }}
                  />
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
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

           
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
                    justifyContent: 'center',
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                    {articulo.nombre}
                  </h3>
                  
                  <p style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#007bff',
                    textAlign: 'center',
                    margin: '0',
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                    ${articulo.price}
                  </p>

                  <p style={{
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'center',
                    margin: '0',
                    height: '36px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                    {articulo.desc}
                  </p>

                
                  <div style={{
                    padding: '5px 10px',
                    backgroundColor: sinStock ? '#ff6b6b' : 
                                   cantidadDisponible <= 5 ? '#ffa94d' : '#51cf66',
                    color: 'white',
                    borderRadius: '15px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                    {sinStock ? '❌ AGOTADO' : 
                     cantidadDisponible <= 5 ? `⚠️ Últimas ${cantidadDisponible}` : 
                     `📦 Stock: ${cantidadDisponible}`}
                  </div>

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
                        fontFamily: 'Quicksand, sans-serif'
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
                        minWidth: '40px',
                        fontFamily: 'Quicksand, sans-serif'
                      }}
                    >
                      {esFavorito ? '⭐' : '☆'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {articulosFiltrados.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '20px'
        }}>
          {Array.from({ length: Math.ceil(articulosFiltrados.length / ARTICULOS_POR_FILA) }, (_, i) => (
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
      )}

      <div style={{ 
        width: '100%', 
        textAlign: 'center', 
        marginTop: '30px',
        padding: '20px'
      }}>
  
      </div>

    
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