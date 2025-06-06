import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { obtenerActividades, updateUserInterests } from '../services/interests';
import { authService } from '../services/authService';
import '../styles/Dashboard.css';


interface UserProfile {
  name: string;
  email: string;
  interests: string[];
}



const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    interests: []
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    name: '',
    email: '',
    interests: []
  });
  const [password, setPassword] = useState('');
  const [actividades, setActividades] = useState<any[]>([]);
  const handleLogout = () => {
    authService.logout();
    window.location.assign('/');
  };
  useEffect(() => {
    if (!localStorage.getItem('token')) {
    }
  }, [navigate]);

  
  // UseEffect para borrar mensajes dentro de 2 segs.
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError(null);
        setMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, message]);
  
  // UseEffect para carga de datos.
  useEffect(() => {
    setError(null);
    setMessage(null);
    const cargarDatos = async () => {
      try {
        const userData = await userService.getProfile();
        const data = await obtenerActividades();

        setProfile(userData);
        setEditedProfile(userData);
        setActividades(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);


  const handleProfileUpdate = async () => {
  try {
    const updateData = {
      ...editedProfile,
      password: password || undefined
    };
    await userService.updateProfile(updateData);
    setProfile(editedProfile);
    setEditingProfile(false);
    setPassword('');
    setError(null);
    setMessage('Perfil actualizado correctamente');
  } catch (err) {
    setError('Error al actualizar el perfil');
  }
};



  if (!localStorage.getItem('token')) {
    navigate('/');
    return null;
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <button 
          className={`sidebar-button ${activeSection === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          Perfil
        </button>
        <button 
          className={`sidebar-button ${activeSection === 'interests' ? 'active' : ''}`}
          onClick={() => setActiveSection('interests')}
        >
          Intereses
        </button>
        <button 
          className="sidebar-button"
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </button>
        <button 
          className="sidebar-button logout-button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
      
      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        {activeSection === 'profile' && (
          <div className="profile-section">
            <h2>Mi Perfil</h2>
            {!editingProfile ? (
              <>
                <div className="profile-info">
                  <p><strong>Nombre:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                </div>
                <button 
                  className="edit-button"
                  onClick={() => setEditingProfile(true)}
                >
                  Editar Perfil
                </button>
              </>
            ) : (
              <form className="profile-form" onSubmit={(e) => {
                e.preventDefault();
                handleProfileUpdate();
              }}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input 
                    type="text" 
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      name: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      email: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña (opcional)</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Dejar en blanco para mantener la actual"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit">Guardar Cambios</button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingProfile(false);
                      setEditedProfile(profile);
                      setPassword('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        
        {activeSection === 'interests' && (
          <div className="interests-section">
            <h2>Mis Intereses</h2>
            <div className="interests-grid">
              {actividades.map((actividad) => (
                <label key={actividad.id} className="interest-item">
                  <input
                    type="checkbox"
                    checked={editedProfile.interests.includes(actividad.name)}
                    onChange={(e) => {
                      const newInterests = e.target.checked
                        ? [...editedProfile.interests, actividad.name]
                        : editedProfile.interests.filter(i => i !== actividad.name);
                      setEditedProfile({
                        ...editedProfile,
                        interests: newInterests
                      });
                    }}
                  />
                  {actividad.name}
                </label>
              ))}
            </div>
            <button onClick={async () => {
              try {
                await updateUserInterests(editedProfile.interests);
                setProfile({ ...profile, interests: editedProfile.interests });
                setMessage('Intereses actualizados correctamente');
                setError(null);
              } catch (error) {
                setMessage(null);
                setError('No se pudieron actualizar los intereses');

              }
            }}>
              Actualizar Intereses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;