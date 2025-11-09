import React, { useState } from 'react';
import '../../Estilos/Contacto.css';

const Contacto = () => {
  const [currentView, setCurrentView] = useState('inicio');

  const renderContent = () => {
    switch (currentView) {
      case 'formulario':
        return <FormularioContacto />;
      case 'mapa':
        return <Mapa />;
      case 'calendario':
        return <Calendario />;
      default:
        return (
          <p className="contacto-inicio-texto">
            Selecciona una opción para ver más información.
          </p>
        );
    }
  };

  return (
    <>
      <h2 className="contacto-titulo">📞 Contáctanos</h2>
      
      <div className="contacto-botones-container">
        <button 
          onClick={() => setCurrentView('formulario')}
          className="contacto-boton"
        >
          📝 Formulario
        </button>
        <button 
          onClick={() => setCurrentView('mapa')}
          className="contacto-boton"
        >
          📍 Mapa
        </button>
        <button 
          onClick={() => setCurrentView('calendario')}
          className="contacto-boton"
        >
          📅 Calendario
        </button>
      </div>

      <div className="contacto-contenido">
        {renderContent()}
      </div>

      <div className="whatsapp-container">
        <a 
          href="https://wa.me/554570355?text=Hola!!,%20quiero%20informes%20de%20los%20artículos%20en%20venta%20de%20la%20Papelería%20Karen,%20por%20favor." 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-link"
        >
          💬 WhatsApp
        </a>
      </div>
    </>
  );
};

// Subcomponentes de Contacto
const FormularioContacto = () => {
  const [formData, setFormData] = useState({
    correo: '',
    mensaje: '',
    tema: '',
    pais: '',
    acepto: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formulario enviado (funcionalidad de envío pendiente)');
  };

  return (
    <>
      <h3>📝 Envíanos un mensaje</h3>
      <form onSubmit={handleSubmit} className="formulario-contacto">
        <label htmlFor="correo">Correo</label>
        <input 
          id="correo" 
          name="correo" 
          type="email" 
          required 
          placeholder="tu@correo.com" 
          autoComplete="email"
          value={formData.correo}
          onChange={handleChange}
          className="formulario-input"
        />

        <label htmlFor="mensaje">Mensaje</label>
        <textarea 
          id="mensaje" 
          name="mensaje" 
          rows="3" 
          placeholder="Escribe tu mensaje…"
          value={formData.mensaje}
          onChange={handleChange}
          className="formulario-textarea"
        />

        <fieldset className="formulario-fieldset">
          <legend>Preferencias</legend>
          <label className="formulario-radio-label">
            <input 
              type="radio" 
              name="tema" 
              value="claro"
              checked={formData.tema === 'claro'}
              onChange={handleChange}
              className="formulario-radio"
            /> Claro
          </label>
          <label className="formulario-radio-label">
            <input 
              type="radio" 
              name="tema" 
              value="oscuro"
              checked={formData.tema === 'oscuro'}
              onChange={handleChange}
              className="formulario-radio"
            /> Oscuro
          </label>
        </fieldset>

        <label htmlFor="pais">País</label>
        <select 
          id="pais" 
          name="pais" 
          required
          value={formData.pais}
          onChange={handleChange}
          className="formulario-select"
        >
          <option value="">Selecciona…</option>
          <option value="México">México</option>
          <option value="Colombia">Colombia</option>
          <option value="Perú">Perú</option>
        </select>

        <label className="formulario-checkbox-label">
          <input 
            type="checkbox" 
            name="acepto" 
            required
            checked={formData.acepto}
            onChange={handleChange}
            className="formulario-checkbox"
          /> Acepto términos
        </label>
        <button type="submit" className="formulario-boton">Enviar</button>
      </form>
    </>
  );
};

const Mapa = () => (
  <>
    <h3>📍 Nuestra ubicación</h3>
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d235.40263068601297!2d-99.00212212944773!3d19.263131699999995!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce1cb0002b3e5b%3A0x984495b2c6cdc485!2sPapeleria%20%22Karen%22!5e0!3m2!1ses-419!2smx!4v1762048531067!5m2!1ses-419!2smx"
      width="600" 
      height="450" 
      className="mapa-iframe"
      allowFullScreen 
      loading="lazy" 
      referrerPolicy="no-referrer-when-downgrade"
      title="Ubicación Papelería Karen"
    >
    </iframe>
  </>
);

const Calendario = () => (
  <>
    <h3>📅 Calendario Papelería Karen</h3>
    <iframe 
      src="https://calendar.google.com/calendar/embed?src=d64c0cf7334f7b8601c50f453e22f66a7d8e7c9678961dc960036f6430736f92%40group.calendar.google.com&ctz=America%2FMexico_City" 
      className="calendario-iframe"
      width="600" 
      height="600" 
      frameBorder="0" 
      scrolling="no"
      title="Calendario Papelería Karen"
    >
    </iframe>
  </>
);

export default Contacto;