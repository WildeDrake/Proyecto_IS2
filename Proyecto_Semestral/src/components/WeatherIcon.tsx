import React from "react";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";

interface WeatherIconProps {
  main: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ main, size = 48 }) => {
  const iconMap: Record<string, React.JSX.Element> = {
    Clear: <WiDaySunny size={size} />,
    Clouds: <WiCloud size={size} />,
    Rain: <WiRain size={size} />,
    Snow: <WiSnow size={size} />,
    Thunderstorm: <WiThunderstorm size={size} />,
    Drizzle: <WiRain size={size} />,
    Mist: <WiFog size={size} />,
    Smoke: <WiFog size={size} />,
    Haze: <WiFog size={size} />,
    Fog: <WiFog size={size} />,
    Dust: <WiFog size={size} />,
    Sand: <WiFog size={size} />,
    Ash: <WiFog size={size} />,
    Squall: <WiFog size={size} />,
    Tornado: <WiThunderstorm size={size} />,
  };

  return iconMap[main] || <WiDaySunny size={size} />;
};

export default WeatherIcon;