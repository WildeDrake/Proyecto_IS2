import React from "react";
import '../styles/MapView.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface MapViewProps {
  weather: WeatherData | null;
}

const MapView: React.FC<MapViewProps> = ({ weather }) => (
  <div className="map-container">
    {weather && (
      <MapContainer
        center={[weather.coord.lat, weather.coord.lon]}
        zoom={10}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[weather.coord.lat, weather.coord.lon]}>
          <Popup>{weather.name}</Popup>
        </Marker>
      </MapContainer>
    )}
  </div>
);

export default MapView;