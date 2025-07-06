import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { createInterest } from '../services/interests';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/Auth.css';


const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [interesesElegidos, setInterests] = useState<string[]>([]);

  const sugerenciasIniciales = [
    { name: "Ciclismo" },
    { name: "Escalada" },
    { name: "Natación" },
    { name: "Futbol" },
    { name: "Trotar" },
    { name: "Yoga" },
    { name: "Senderismo" },
    { name: "Surf" },
    { name: "Bailar" },
    { name: "Correr" },
    { name: "Gimnasio" },
    { name: "Boxeo" },
    { name: "Fotografía" },
    { name: "Jardinería" }
];

  const handleInterestChange = (actividad: string) => {
    setInterests(prev =>
      prev.includes(actividad)
        ? prev.filter(i => i !== actividad)
        : [...prev, actividad]
    );
  };

  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    // Para campos de email, personalizar el mensaje según el tipo de error
    if (target.type === 'email') {
      const value = target.value;
      if (!value) {
        target.setCustomValidity('Completa este campo');
      } else if (!value.includes('@')) {
        target.setCustomValidity('Incluye una @ en el email');
      } else if (value.indexOf('@') === value.length - 1) {
        target.setCustomValidity('Completa el email correctamente');
      } else {
        target.setCustomValidity('Formato de email inválido');
      }
    } else {
      if (target.name === 'name') {
        target.setCustomValidity('Completa este campo');
      } else if (target.name === 'password') {
        target.setCustomValidity('Ingresa una contraseña');
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4 || password.length > 12) {
      setError('La contraseña debe tener entre 4 y 12 caracteres.');
      return;
    }

    try {
      await authService.register(name, email, password);
      const loginResult = await authService.login(email, password); 
      if (loginResult.token) {
        localStorage.setItem('token', loginResult.token);

        for (const actividad of interesesElegidos) {
          await createInterest({
            name: actividad,
          });
        }

        // Redirigir al perfil del usuario
        navigate(`/user/${loginResult.user.id}`);
      }
    } catch (err) {
      setError('Error al registrarse. Verifica tus datos.');
      console.error(err);
    }
  };
  return (
    <div className="page-container">
      <Navbar showSearchBar={false} />
      <div className="register-page-form">
        <div className="register-form-container">
          <h1>Crear Cuenta</h1>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="simple-error-message">{error}</div>}
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onInvalid={handleInvalid}
                onInput={handleInput}
                required
                placeholder="Ej: Pepe"
                title=""
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onInvalid={handleInvalid}
                onInput={handleInput}
                required
                placeholder="Ej: pepito@gmail.com"
                title=""
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onInvalid={handleInvalid}
                onInput={handleInput}
                required
                placeholder="Introduzca una contraseña de 4 a 12 caracteres"
                title=""
              />
            </div>
            <div className="form-group">
              <label>Intereses:</label>
              <div className="interests-grid">
                { sugerenciasIniciales.map((actividad, index) => (
                  <label key={index} className="interest-checkbox">
                    <input
                      type="checkbox"
                      checked={interesesElegidos.includes(actividad.name)}
                      onChange={() => handleInterestChange(actividad.name)}
                    />
                    {actividad.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Registrarse</button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancelar
              </button>
            </div>
          </form>
          <p className="login-link">
            ¿Ya tienes una cuenta? <a onClick={() => navigate('/', { state: { showLogin: true } })}>Inicia sesión aquí</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;