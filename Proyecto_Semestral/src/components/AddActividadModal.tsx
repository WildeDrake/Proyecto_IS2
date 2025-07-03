import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import '../styles/AddActividadModal.css';
import { createInterest } from '../services/interests';

interface AddActividadModalProps {
  onClose: () => void;
  onAdd: (actividad: {
    name: string;
    climas: string[];
    tempMin: number;
    tempMax: number;
    windMin?: number;
    windMax?: number;
    humidityMax?: number;
  }) => void;
}

const CLIMAS = [
  { value: 'Clear', label: 'Despejado' },
  { value: 'Clouds', label: 'Nublado' },
  { value: 'Rain', label: 'Lluvia' },
  { value: 'Snow', label: 'Nieve' },
  { value: 'Thunderstorm', label: 'Tormenta eléctrica' },
  { value: 'Drizzle', label: 'Llovizna' },
  { value: 'Mist', label: 'Neblina' },
  { value: 'Haze', label: 'Aire Brumoso' },
  { value: 'Dust', label: 'Polvo en el aire' },
  { value: 'Fog', label: 'Niebla' },
  { value: 'Ash', label: 'Ceniza volcánica' },
  { value: 'Squall', label: 'Ráfagas de viento' },
];

const TEMP_MIN = -30;
const TEMP_MAX = 60;
const WIND_MIN = 0;
const WIND_MAX = 30;

const AddActividadModal: React.FC<AddActividadModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [climas, setClimas] = useState<string[]>([]);
  const [tempRange, setTempRange] = useState<[number, number]>([TEMP_MIN, TEMP_MAX]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [windRange, setWindRange] = useState<[number, number]>([WIND_MIN, WIND_MAX]);
  const [humidityMax, setHumidityMax] = useState(60);
  const [climaError, setClimaError] = useState(false); // Nuevo estado para error

  const handleClimaChange = (clima: string) => {
    setClimas((prev) =>
      prev.includes(clima) ? prev.filter((c) => c !== clima) : [...prev, clima]
    );
    setClimaError(false); // Limpiar error al seleccionar
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (climas.length === 0) {
      setClimaError(true);
      return;
    }
    if (
      name.trim() &&
      tempRange[0] !== null &&
      tempRange[1] !== null
    ) {
      const actividad = {
        name: name.trim(),
        climas,
        tempMin: tempRange[0],
        tempMax: tempRange[1],
        windMin: showAdvanced ? windRange[0] : undefined,
        windMax: showAdvanced ? windRange[1] : undefined,
        humidityMax: showAdvanced ? humidityMax : undefined,
        requiereSinLluvia: false // campo extra requerido por la base de datos
      };
      onAdd(actividad); // Aquí puedes llamar a tu función que guarda en la base de datos
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Agregar Nueva Actividad</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de actividad</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Climas permitidos</label>
            <div className="climas-list">
              {CLIMAS.map(clima => (
                <label key={clima.value} className="clima-checkbox">
                  <input
                    type="checkbox"
                    checked={climas.includes(clima.value)}
                    onChange={() => handleClimaChange(clima.value)}
                  />
                  {clima.label}
                </label>
              ))}
            </div>
            {climaError && (
              <div style={{ color: 'red', marginTop: 6, fontSize: 13 }}>
                Debes seleccionar al menos un clima.
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Rango de temperatura aceptable (°C)</label>
            <div className="slider-container">
              <Range
                step={1}
                min={TEMP_MIN}
                max={TEMP_MAX}
                values={tempRange}
                onChange={values => setTempRange([Math.min(values[0], values[1]), Math.max(values[0], values[1])])}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="slider-track"
                    style={{
                      ...props.style,
                      background: getTrackBackground({
                        values: tempRange,
                        colors: ['#ccc', '#548BF4', '#ccc'],
                        min: TEMP_MIN,
                        max: TEMP_MAX
                      })
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ index, props, value }) => (
                  <div
                    {...props}
                    className="slider-thumb"
                  >
                    <div className="slider-thumb-label">
                      {value === TEMP_MIN
                        ? `${TEMP_MIN}°C`
                        : value === TEMP_MAX
                        ? `${TEMP_MAX}°C`
                        : `${value}°C`}
                    </div>
                  </div>
                )}
                allowOverlap={false}
                draggableTrack={false}
              />
              <div className="slider-labels">
                <span>{TEMP_MIN}°C</span>
                <span>{TEMP_MAX}°C</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="advanced-btn"
            >
              {showAdvanced ? 'Contraer parámetros avanzados' : 'Parámetros avanzados'}
            </button>
          </div>
          {showAdvanced && (
            <div className="advanced-params">
              <div className="form-group">
                <label>Rango de velocidad del viento (m/s)</label>
                <div className="slider-container">
                  <Range
                    step={1}
                    min={WIND_MIN}
                    max={WIND_MAX}
                    values={windRange}
                    onChange={values => setWindRange([Math.min(values[0], values[1]), Math.max(values[0], values[1])])}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="slider-track"
                        style={{
                          ...props.style,
                          background: getTrackBackground({
                            values: windRange,
                            colors: ['#ccc', '#548BF4', '#ccc'],
                            min: WIND_MIN,
                            max: WIND_MAX
                          })
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ index, props, value }) => (
                      <div
                        {...props}
                        className="slider-thumb"
                      >
                        <div className="slider-thumb-label">
                          {value === WIND_MIN
                            ? `${WIND_MIN} m/s`
                            : value === WIND_MAX
                            ? `${WIND_MAX} m/s`
                            : `${value} m/s`}
                        </div>
                      </div>
                    )}
                    allowOverlap={false}
                    draggableTrack={false}
                  />
                  <div className="slider-labels">
                    <span>{WIND_MIN} m/s</span>
                    <span>{WIND_MAX} m/s</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Humedad máxima permitida (%)</label>
                <div className="slider-container">
                  <Range
                    step={1}
                    min={0}
                    max={100}
                    values={[humidityMax]}
                    onChange={values => setHumidityMax(values[0])}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="slider-track"
                        style={{
                          ...props.style,
                          background: getTrackBackground({
                            values: [humidityMax],
                            colors: ['#548BF4', '#ccc'],
                            min: 0,
                            max: 100
                          })
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, value }) => (
                      <div
                        {...props}
                        className="slider-thumb"
                      >
                        <div className="slider-thumb-label">
                          {`${value} %`}
                        </div>
                      </div>
                    )}
                  />
                  <div className="slider-labels">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="form-actions">
            <button type="submit">Agregar</button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActividadModal;
