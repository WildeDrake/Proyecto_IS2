import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { createInterest, getUserInterests, updateInterest, deleteInterest } from '../services/interests';
import { authService } from '../services/authService';
import '../styles/Dashboard.css';
import AddActividadModal from './AddActividadModal';

interface UserProfile {
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: ''
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    name: '',
    email: ''
  });
  const [password, setPassword] = useState('');
  const [actividades, setActividades] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<any | null>(null);

  const handleLogout = () => {
    authService.logout();
    window.location.assign('/');
    window.location.reload();
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError(null);
        setMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, message]);
  useEffect(() => {
    setError(null);
    setMessage(null);
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = await userService.getProfile();
        const data = await getUserInterests();

        setProfile(userData);
        setEditedProfile(userData);
        setActividades(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos del perfil');
        
        if (err.message.includes('autenticación') || err.message.includes('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);


  const handleProfileUpdate = async () => {
    if (password && (password.length < 4 || password.length > 12)) {
      setError('La contraseña debe tener entre 4 y 12 caracteres');
      return;
    }
  try {
    setError(null);
    setMessage(null);
    
    const updateData = {
      ...editedProfile,
      password: password || undefined
    };
    
    await userService.updateProfile(updateData);
    setProfile(editedProfile);
    setEditingProfile(false);
    setPassword('');
    setMessage('Perfil actualizado correctamente');
  } catch (err: any) {
    setError(err.message || 'Error al actualizar el perfil');
  }
};



  const handleAddActividad = async (actividadData: any) => {
  try {
    if (actividadData.id) {
      const { id, ...updateFields } = actividadData;
      await updateInterest(id, updateFields);
    } else {
      await createInterest(actividadData);
    }
    setShowAddModal(false);
    setSelectedActividad(null);
    const interesesActualizados = await getUserInterests();
    setActividades(interesesActualizados);
    setMessage(selectedActividad ? 'Actividad modificada' : 'Actividad personalizada creada');
  } catch (err) {
    setError('Error al guardar la actividad');
  }
};


  const handleDeleteActividad = async (id: number) => {
    try {
      await deleteInterest(id);
      setShowAddModal(false);
      setSelectedActividad(null);
      const interesesActualizados = await getUserInterests();
      setActividades(interesesActualizados);
      setMessage('Actividad eliminada');
    } catch (err) {
      setError('Error al eliminar la actividad');
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
        <img
          src="/images/logo.png"
          alt="Logo"
          className="sidebar-logo"
        />
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
          Mis Intereses
        </button>
        <button 
          className={`sidebar-button ${activeSection === 'myInterests' ? 'active' : ''}`}
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
                    minLength={4}
                    maxLength={12}
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
                <button
                  key={actividad.id}
                  className="interest-item"
                  onClick={() => {
                    setSelectedActividad(actividad);
                    setShowAddModal(true);
                  }}
                  title="Modificar"
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                >
                  {actividad.name}
                </button>
              ))}
            </div>
            <button
              className="add-interest-button"
              onClick={() => {
                setShowAddModal(true);
                setSelectedActividad(null);
              }}
              style={{ marginTop: '16px' }}
            >
              + Añadir
            </button>
          </div>
        )}

        {showAddModal && (
          <AddActividadModal
            onAdd={handleAddActividad}
            onClose={() => {
              setShowAddModal(false);
              setSelectedActividad(null);
            }}
            initialData={selectedActividad}
            onDelete={
              selectedActividad
                ? () => handleDeleteActividad(selectedActividad.id)
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
