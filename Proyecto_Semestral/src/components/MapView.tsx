import React from "react";
import '../styles/MapView.css';
import { WeatherData } from '../types/weather';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface MapViewProps {
  weather: WeatherData | null;
  userCoords?: [number, number] | null;
}
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const MapView: React.FC<MapViewProps> = ({ weather, userCoords}) => (
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
        {userCoords && (
          <Marker position={userCoords} icon={redIcon}>
            <Popup>Tu ubicación actual</Popup>
          </Marker>
        )}
        
      </MapContainer>
    )}
  </div>
);

export default MapView;