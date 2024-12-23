import React from "react";
import"./HeaderWeather.css";
import mañana from "../images/mañana.png";
import tarde from "../images/tarde.png";
import noche from "../images/noche.png";

const HeaderWeather: React.FC = () => {
    const getGreetingAndStyles = () => {
    const currentHour = new Date().getHours();
        
    if (currentHour >= 5 && currentHour <12) {
    return {
        greeting: "¡Buenos días!",
        backgroundColor: "#FFFFFF",
        textColor: "#003C43", // Negro para contraste
        imagePath:mañana,
    };
    } else if (currentHour >= 12 && currentHour < 18) {
    return {
        greeting: "¡Buenas tardes!",
        backgroundColor: "#ffdaad", // Naranja para la tarde
        textColor: "#FB4141", // Blanco para contraste
        imagePath:tarde,
    };
    } else {
    return {
        greeting: "¡Buenas noches!",
        backgroundColor: "#2F4F4F", // Gris oscuro para la madrugada
        textColor: "#FFFFFF", // Blanco para contraste
        imagePath:noche,
    };
    }
};

const { greeting, backgroundColor, textColor, imagePath } = getGreetingAndStyles();

return (
    <div className="header-weather" style={{ backgroundColor }}>
    <div className="header-content">
    <img src={imagePath} alt="Weather Icon" className="weather-icon" />
    <h1 className="greeting" style={{color: textColor}}>{greeting}</h1>
    </div>
</div>
);
};

export default HeaderWeather;