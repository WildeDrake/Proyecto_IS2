import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">¿Quieres saber quiénes somos y más sobre nosotros?.... ¡Contáctanos!</div>
        <div className="footer-links">
          <div className="footer-column">
            <p className="footer-title">Telefono(s)</p>
            <p>(41) 64536...</p>
            <p>(+56) 967584...</p>
            <p>(+56) 965745...</p>
          </div>
          <div className="footer-column">
            <p className="footer-title">Correos y contactos</p>
            <p>correoConsultas@...</p>
            <p>correoTrabajo@...</p>
            <p>Whatsaap 98464..</p>
          </div>
          <div className="footer-column">
            <p className="footer-title">Visita nuestras redes sociales</p>
            <p>@instragram...</p>
            <p>@facebook...</p>
            <p>@twitter...</p>
          </div>
        </div>
        <div className="footer-social">
          <a href="#" className="social-icon">f</a>
          <a href="#" className="social-icon">tw</a>
          <a href="#" className="social-icon">in</a>
          <a href="#" className="social-icon">ig</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;