import React, { useState } from 'react';
import '../styles/LandingPage.css';

interface ActivityOption {
  id: number;
  name: string;
  image: string;
}

const LandingPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const activityOptions: ActivityOption[] = [
    { id: 1, name: '', image: '/activities/leer.jpg' },
    { id: 2, name: '', image: '/activities/cocinar.jpg' },
    { id: 3, name: '', image: '/activities/surf.jpg' },
    { id: 4, name: '', image: '/activities/ciclismo.jpg' },
    { id: 5, name: '', image: '/activities/ski.jpg' },
  ];

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', { name, email, selectedInterests });
    // Aquí iría la lógica para enviar los datos al servidor
    alert('¡Gracias por registrarte! Recibirás recomendaciones personalizadas pronto.');
  };

  const today = new Date();
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = dayNames[today.getDay()];
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');

  return (
    <div className="landing-page">
      {/* Header con información del clima */}
      <div className="weather-header">
        <div className="weather-info">
          <h1>Concepción</h1>
          <div className="weather-details">
            <div className="day-info">
              <p className="day">{dayName}</p>
              <p className="temperature">18°C</p>
              <p className="date">{day}/{month}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de actividades recomendadas */}
      <div className="activities-section">
        <h2>Ideas de panoramas según tus gustos</h2>
        <div className="activities-grid">
          {activityOptions.map(activity => (
            <div key={activity.id} className="activity-card">
              <img src={activity.image} alt={activity.name} />
              <p>{activity.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de registro */}
      <div className="registration-section">
        <h2>¡Regístrate para recibir recomendaciones personalizadas!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Intereses</label>
            <div className="interests-options">
              <button 
                type="button" 
                className={selectedInterests.includes('Playa') ? 'selected' : ''}
                onClick={() => handleInterestToggle('Playa')}
              >
                Playa
              </button>
              <button 
                type="button" 
                className={selectedInterests.includes('Montaña') ? 'selected' : ''}
                onClick={() => handleInterestToggle('Montaña')}
              >
                Montaña
              </button>
              <button 
                type="button" 
                className={selectedInterests.includes('Indoor') ? 'selected' : ''}
                onClick={() => handleInterestToggle('Indoor')}
              >
                Indoor
              </button>
            </div>
          </div>
          <button type="submit" className="submit-button">Crear cuenta</button>
        </form>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <p>Nombre página</p>
          <div className="footer-links">
            <div className="footer-column">
              <p>Topic</p>
              <p>Page</p>
              <p>Page</p>
              <p>Page</p>
            </div>
            <div className="footer-column">
              <p>Topic</p>
              <p>Page</p>
              <p>Page</p>
              <p>Page</p>
            </div>
            <div className="footer-column">
              <p>Topic</p>
              <p>Page</p>
              <p>Page</p>
              <p>Page</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
