// Header.tsx
import React from 'react';

interface HeaderProps {
  temperature: number;  // Temperatura en Kelvin
}

const Header: React.FC<HeaderProps> = ({ temperature }) => {
  // Función para convertir la temperatura de Kelvin a Celsius
  const kelvinToCelsius = (kelvin: number) => (kelvin - 273.15).toFixed(1);

  // Obtener la hora actual
  const currentHour = new Date().getHours();

  // Determinar el saludo y el color de fondo dependiendo de la hora
  const getGreeting = () => {
    if (currentHour >= 5 && currentHour < 12) return "Buenos días";
    if (currentHour >= 12 && currentHour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const getBackgroundColor = () => {
    if (currentHour >= 5 && currentHour < 12) return "#FFD700";  // Amarillo (Día)
    if (currentHour >= 12 && currentHour < 18) return "#FF8C00";  // Naranja (Tarde)
    return "#2F4F4F";  // Gris oscuro (Noche)
  };

  const greeting = getGreeting();
  const backgroundColor = getBackgroundColor();
  const currentTemperature = kelvinToCelsius(temperature);  // Convertir la temperatura de Kelvin a Celsius

  return (
    <div style={{ backgroundColor, color: 'white', padding: '20px', borderRadius: '8px' }}>
      <h1>{greeting}</h1>
      <p>La temperatura actual es: {currentTemperature} °C</p>
    </div>
  );
};

export default Header;
