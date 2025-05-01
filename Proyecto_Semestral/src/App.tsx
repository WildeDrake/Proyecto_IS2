import React from "react";
import LandingPage from "./components/LandingPage";
import './styles/App.css';
import 'leaflet/dist/leaflet.css';


const App: React.FC = () => {
  return (
    <div>
      <LandingPage />
    </div>
  );
};

export default App;