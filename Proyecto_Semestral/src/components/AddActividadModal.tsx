import React, { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import '../styles/AddActividadModal.css';

interface AddActividadModalProps {
  onClose: () => void;
  onAdd: (actividad: any) => void;
  initialData?: any;
  onDelete?: () => void; 
}

const CLIMAS = [
  { value: 800, label: 'Despejado' },
  { value: 801, label: 'Pocas nubes' },
  { value: 802, label: 'Nubes dispersas' },
  { value: 804, label: 'Muy nublado' },
  { value: 500, label: 'Lluvia ligera' },
  { value: 501, label: 'Lluvia moderada' },
  { value: 502, label: 'Lluvia intensa' },
  { value: 600, label: 'Nieve ligera' },
  { value: 601, label: 'Nieve' },
  { value: 200, label: 'Tormenta eléctrica' },
  { value: 300, label: 'Llovizna' },
  { value: 741, label: 'Niebla' },
  { value: 721, label: 'Aire brumoso' },
  { value: 771, label: 'Ráfagas de viento' },
];

const TEMP_MIN = -30;
const TEMP_MAX = 60;
const WIND_MIN = 0;
const WIND_MAX = 30;
const HUMIDITY_MIN = 0;
const HUMIDITY_MAX = 100;

const AddActividadModal: React.FC<AddActividadModalProps> = ({ onClose, onAdd, initialData, onDelete }) => {
  const [actividadId, setActividadId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [descripcion, setDescription] = useState('');
  const [climas, setClimas] = useState<number[]>([]);
  const [tempRange, setTempRange] = useState<[number, number]>([TEMP_MIN, TEMP_MAX]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [windRange, setWindRange] = useState<[number, number]>([WIND_MIN, WIND_MAX]);
  const [humedadRange, setHumedadRange] = useState<[number, number]>([HUMIDITY_MIN, HUMIDITY_MAX]);
  const [climaError, setClimaError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [requiereLluvia, setRequiereLluvia] = useState(false);
  const [estado, setEstado] = useState(true);
  const [visMinKm, setVisMinKm] = useState(1);

  useEffect(() => {
  if (initialData) {
    setActividadId(initialData.id ?? null);
    setName(initialData.name || '');
    setDescription('');
    setRequiereLluvia(initialData.requiere_sin_lluvia ?? false);
    setEstado(initialData?.estado ?? true);
    setVisMinKm(typeof initialData.vis_min_km === 'number' ? initialData.vis_min_km : 0);
    setClimas(Array.isArray(initialData.climas_permitidos) ? initialData.climas_permitidos : []);
    setTempRange([
      typeof initialData.temp_min === 'number' ? initialData.temp_min : TEMP_MIN,
      typeof initialData.temp_max === 'number' ? initialData.temp_max : TEMP_MAX,
    ]);
    setShowAdvanced(
      initialData.viento_min !== undefined ||
      initialData.viento_max !== undefined ||
      initialData.humedad_max !== undefined
    );
    setWindRange([
      typeof initialData.viento_min === 'number' ? initialData.viento_min : WIND_MIN,
      typeof initialData.viento_max === 'number' ? initialData.viento_max : WIND_MAX,
    ]);
    setHumedadRange([
      typeof initialData.humedad_min === 'number' ? initialData.humedad_min : 0,
      typeof initialData.humedad_max === 'number' ? initialData.humedad_max : 100,
    ]);
  } else {
    setActividadId(null);
    setName('');
    setClimas([]);
    setTempRange([TEMP_MIN, TEMP_MAX]);
    setShowAdvanced(false);
    setWindRange([WIND_MIN, WIND_MAX]);
    setHumedadRange([HUMIDITY_MIN, HUMIDITY_MAX]);
    setEstado(true);
    setDescription('');
    setRequiereLluvia(false);
    setVisMinKm(10);
  }
  setClimaError(false);
}, [initialData]);


  const handleClimaChange = (climaValue: number) => {
    setClimas((prev) =>
      prev.includes(climaValue) ? prev.filter((c) => c !== climaValue) : [...prev, climaValue]
    );
    setClimaError(false);
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
        id: actividadId ?? undefined,
        name: name.trim(),
        climas_permitidos: climas,
        temp_min: tempRange[0],
        temp_max: tempRange[1],
        viento_min: showAdvanced ? windRange[0] : 0,
        viento_max: showAdvanced ? windRange[1] : 30,
        humedad_min: humedadRange[0],
        humedad_max: humedadRange[1],
        vis_min_km: visMinKm || 1,
        requiere_sin_lluvia: Boolean(requiereLluvia),
        estado: Boolean(estado)
      };
      onAdd(actividad);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>
          {initialData ? 'Modificar Actividad' : 'Agregar Nueva Actividad'}
        </h3>
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
          {/* Campo descripción temporalmente deshabilitado - falta columna en BD
          <div className="form-group">
            <label> Descripción / Notas </label>
            <textarea
            className="form-input"
            value={descripcion}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Puedes agregar una nota o detalle sobre esta actividad"
            rows={3}
            />
          </div>
          */}
          <div className="form-group">
            <label>Climas permitidos</label>
            <div className="climas-list">
              {CLIMAS.map((clima) => (
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
                renderThumb={({ props, value }) => (
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
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={requiereLluvia}
                onChange={(e) => setRequiereLluvia(e.target.checked)}
              />
              Requiere lluvia
            </label>
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
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={estado}
                    onChange={(e) => setEstado(e.target.checked)}
                  />
                  Activar actividad <span style={{ fontSize: '12px', color: '#888' }}>(si no está activada, no aparecerá en recomendaciones)</span>
                </label>
              </div>
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
                    renderThumb={({ props, value }) => (
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
                <label>Rango de humedad permitida (%)</label>
                <div className="slider-container">
                  <Range
                    step={1}
                    min={0}
                    max={100}
                    values={humedadRange}
                    onChange={values => setHumedadRange([Math.min(values[0], values[1]), Math.max(values[0], values[1])])}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="slider-track"
                        style={{
                          ...props.style,
                          background: getTrackBackground({
                            values: humedadRange,
                            colors: ['#ccc', '#548BF4', '#ccc'],
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
                    allowOverlap={false}
                    draggableTrack={false}
                  />
                  <div className="slider-labels">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>  
              <div className="form-group">
                <label>Visibilidad mínima permitida (km)</label>
                <div className="slider-container">
                  <Range
                    step={1}
                    min={0}
                    max={50}  // Ajusta el máximo según lo que consideres válido
                    values={[visMinKm]}
                    onChange={values => setVisMinKm(values[0])}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="slider-track"
                        style={{
                          ...props.style,
                          background: getTrackBackground({
                            values: [visMinKm],
                            colors: ['#548BF4', '#ccc'],
                            min: 0,
                            max: 50
                          })
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, value }) => (
                      <div {...props} className="slider-thumb">
                        <div className="slider-thumb-label">{`${value} km`}</div>
                      </div>
                    )}
                  />
                  <div className="slider-labels">
                    <span>0 km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="form-actions">
            <button type="submit">{initialData ? 'Guardar Cambios' : 'Agregar'}</button>
            {initialData && onDelete && (
              <>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ marginLeft: 8, color: 'white', background: 'red' }}
                >
                  Quitar
                </button>
                {showDeleteConfirm && (
                  <div className="delete-confirm-modal">
                    <div className="delete-confirm-content">
                      <p>¿Confirma quitar la actividad?</p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          onDelete();
                        }}
                        style={{ color: 'white', background: 'red', marginRight: 8 }}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
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
