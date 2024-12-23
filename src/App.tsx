import "./App.css";
import Grid from "@mui/material/Grid2";
import IndicatorWeather from "./components/IndicatorWeather";
import TableWeather from "./components/TableWeather";
import ControlWeather from "./components/ControlWeather";
import LineChartWeather from "./components/LineChartWeather";
import Item from "./interface/item";
import HeaderWeather from "./components/HeaderWeather";
import { useEffect, useState } from 'react';

interface Indicator {
  title?: string;
  subtitle?: string;
  value?: string;
}

function App() {
  // Estados
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [owm, setOWM] = useState<string | null>(localStorage.getItem("openWeatherMap"));
  const [items, setItems] = useState<Item[]>([]);
  const [dates, setDates] = useState<string[]>([]);  // Fechas disponibles
  const [selectedDate, setSelectedDate] = useState<string>("");  // Fecha seleccionada
  const [selectedHour, ] = useState<string>("");  // Hora seleccionada
  const [, setHours] = useState<string[]>([]);  // Horas disponibles

  // Hook para obtener y procesar datos
  useEffect(() => {
    const request = async () => {
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      const expiringTime = localStorage.getItem("expiringTime");

      let nowTime = (new Date()).getTime();
      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        const API_KEY = "4c2f62dbdfec40df92bf08ed666c20cc";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
        savedTextXML = await response.text();
        
        // Almacenar los datos en localStorage
        const hours = 0.01;  // Definir tiempo de expiración en horas
        const delay = hours * 3600000;
        const newExpiringTime = nowTime + delay;
        
        localStorage.setItem("openWeatherMap", savedTextXML);
        localStorage.setItem("expiringTime", newExpiringTime.toString());
        localStorage.setItem("nowTime", nowTime.toString());
        localStorage.setItem("expiringDateTime", new Date(newExpiringTime).toString());
        localStorage.setItem("nowDateTime", new Date(nowTime).toString());
        setOWM(savedTextXML);  
      }

      if (savedTextXML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        // Extraer datos de la respuesta XML
        let dataToIndicators: Indicator[] = [];
        let name = xml.getElementsByTagName("name")[0]?.innerHTML || "";
        let country = xml.getElementsByTagName("country")[0]?.innerHTML || "";
        dataToIndicators.push({ title: "Ubicación", subtitle: country, value: name });

        let location = xml.getElementsByTagName("location")[1];
        let latitude = location?.getAttribute("latitude") || "";
        dataToIndicators.push({ title: "Latitud", subtitle: "° (grados)", value: latitude });
        let longitude = location?.getAttribute("longitude") || "";
        dataToIndicators.push({ title: "Longitud", subtitle: "° (grados)", value: longitude });
        let altitude = location?.getAttribute("altitude") || "";
        dataToIndicators.push({ title: "Altitud", subtitle: "msnm (metros sobre el nivel del mar)", value: altitude });

        setIndicators(dataToIndicators);  // Actualizar indicadores

        // Procesar datos para la tabla
        let dataToItems: Item[] = [];
        let dateSet = new Set<string>();  // Fechas únicas
        let hoursSet = new Set<string>();  // Horas únicas

        const timeElements = xml.getElementsByTagName("time");

        for (const timeElement of Array.from(timeElements)) {
          const dateStart = timeElement.getAttribute("from");
          const dateEnd = timeElement.getAttribute("to");

          const precipitation = timeElement.querySelector("precipitation")?.getAttribute("probability") || "";
          const humidity = timeElement.querySelector("humidity")?.getAttribute("value") || "";
          const temperature = timeElement.querySelector("temperature")?.getAttribute("value") || "";
          const clouds = timeElement.querySelector("clouds")?.getAttribute("all") || "";

          if (dateStart) {
            let date = dateStart.split('T')[0];  // Extraer la fecha
            dateSet.add(date);  // Agregar la fecha al Set
            let hour = dateStart.split('T')[1];  // Extraer la hora
            hoursSet.add(hour);  // Agregar la hora al Set
          }

          dataToItems.push({ dateStart, dateEnd, precipitation, humidity, clouds, temperature });
        }

        setItems(dataToItems);
        setDates(Array.from(dateSet));  // Establecer fechas únicas
        setHours(Array.from(hoursSet));  // Establecer horas únicas
      }
    };

    request();
  }, [owm, selectedDate]);

  // Manejar cambios de fecha
  const handleDateChange = (event: { target: { value: string } }) => {
    setSelectedDate(event.target.value);
  };


  // Filtrar los items por la fecha seleccionada
  const filteredItems = selectedDate
    ? items.filter((item) => item.dateStart?.startsWith(selectedDate))
    : items;

  // Gráfico de datos
  useEffect(() => {
    const tempArray: number[] = [];
    const humidityArray: number[] = [];
    const hoursArray: string[] = [];

    filteredItems.forEach((item) => {
      const temp = parseFloat(item.temperature || "0");
      const hum = parseFloat(item.humidity || "0");
      tempArray.push(temp);
      humidityArray.push(hum);

      if (item.dateStart) {
        const [date, time] = item.dateStart.split("T");
        hoursArray.push(`${date} ${time}`);
      }
    });

    setHours(hoursArray);
  }, [filteredItems, selectedHour]);

  // Renderizar los indicadores
  const renderIndicators = () => {
    return indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather
          title={indicator.title}
          subtitle={indicator.subtitle}
          value={indicator.value}
        />
      </Grid>
    ));
  };

  return (
    <>
      <HeaderWeather />
      <Grid container spacing={5}>
        {renderIndicators()}

        {/* Tabla de datos */}
        <Grid size={{ xs: 12, xl: 8 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, xl: 3 }}>
              <ControlWeather
                dates={dates}
                onDateChange={handleDateChange}
              />
            </Grid>
            <Grid size={{ xs: 12, xl: 9 }}>
              <TableWeather itemsIn={filteredItems} selectedDate={selectedDate} selectedHour={selectedHour} />
            </Grid>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, xl: 4 }}>
          {selectedDate}
          <LineChartWeather itemsIn={filteredItems} />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
