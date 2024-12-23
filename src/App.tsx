import "./App.css";
import Grid from "@mui/material/Grid2";
import IndicatorWeather from "./components/IndicatorWeather";
import TableWeather from "./components/TableWeather";
import ControlWeather from "./components/ControlWeather";
import LineChartWeather from "./components/LineChartWeather";
import Item from "./interface/item";
import HeaderWeather from "./components/HeaderWeather";


 {/* Hooks */ }
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
  let [items, setItems]= useState<Item[]>([]);
  //FECHA 
  let [dates, setDates] = useState<string[]>([]); // Para almacenar las fechas disponibles
  let [selectedDate, setSelectedDate] = useState<string>(""); // Fecha seleccionada
  let [selectedHour, setSelectedHour] = useState<string>(""); // Hora seleccionada
  const [, setTemperature] = useState<number[]>([]);
  const [, setHumidity] = useState<number[]>([]);
  const [hours, setHours] = useState<string[]>([]); 

  {/* Hook: useEffect */}
  useEffect( ()=>{
    let request = async () => { 
      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */}
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      {/* Obtenga la estampa de tiempo actual */}
      let nowTime = (new Date()).getTime();
    
      {/* Verifique si es que no existe la clave expiringTime o si la estampa de tiempo actual supera el tiempo de expiración */}
      if(expiringTime === null || nowTime > parseInt(expiringTime)) {

      {/* Request */}
      let API_KEY = "4c2f62dbdfec40df92bf08ed666c20cc"
      let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
      let savedTextXML = await response.text();    
      
          {/* Tiempo de expiración */}
          let hours = 0.01
          let delay = hours * 3600000
          let expiringTime = nowTime + delay


          {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */}
          localStorage.setItem("openWeatherMap", savedTextXML)
          localStorage.setItem("expiringTime", expiringTime.toString())
          localStorage.setItem("nowTime", nowTime.toString())

          {/* DateTime */}
          localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
          localStorage.setItem("nowDateTime", new Date(nowTime).toString())

          {/* Modificación de la variable de estado mediante la función de actualización */ }
          setOWM( savedTextXML )
      }

        {/* Valide el procesamiento con el valor de savedTextXML */}
      if( savedTextXML ) {
        {/* XML Parser */}
      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      {/* Arreglo para agregar los resultados */ }
      let dataToIndicators: Indicator[] = new Array<Indicator>();

      {/* Análisis, extracción y almacenamiento del contenido del XML 
         en el arreglo de resultados*/}
      let name = xml.getElementsByTagName("name")[0].innerHTML || ""
      let country = xml.getElementsByTagName("country")[0].innerHTML || ""

      dataToIndicators.push({ "title": "Ubicación", "subtitle": country, "value": name })

      let location = xml.getElementsByTagName("location")[1]
      let latitude = location.getAttribute("latitude") || ""
      dataToIndicators.push({ "title": "Latitud", "subtitle": "° (grados)", "value": latitude })
      let longitude = location.getAttribute("longitude") || ""
      dataToIndicators.push({ "title": "Longitud", "subtitle": "° (grados)", "value": longitude })
      let altitude = location.getAttribute("altitude") || ""
      dataToIndicators.push({ "title": "Altitud", "subtitle": "msnm (metros sobre el nivel del mar)", "value": altitude })
  
         {/* Modificación de la variable de estado mediante la función de actualización */}
        setIndicators( dataToIndicators )



        let dataToItems: Item[]= [];
        let dateSet = new Set<string>(); // Usamos un Set para obtener fechas únicas
        let hoursSet = new Set<string>(); // Para las horas disponibles

        const timeElements= xml.getElementsByTagName("time");

        for(const timeElement of Array.from(timeElements)){
          const dateStart=timeElement.getAttribute("from");
          const dateEnd=timeElement.getAttribute("to");

          const precipitation= timeElement.querySelector("precipitation")?.getAttribute("probability")|| "";
          const humidity= timeElement.querySelector("humidity")?.getAttribute("value")|| ""; 
          const temperature= timeElement.querySelector("temperature")?.getAttribute("value")|| ""; 
          const clouds= timeElement.querySelector("clouds")?.getAttribute("all")|| "";
          
          if (dateStart) {
            let date = dateStart.split('T')[0]; // Extraer solo la fecha
            dateSet.add(date); 
            let hour = dateStart.split('T')[1]; // Extraer la hora
            hoursSet.add(hour); // Agregar la hora al Set
          }
          dataToItems.push({ hour, dateStart, dateEnd, precipitation, humidity, clouds, temperature });
        }

          setItems(dataToItems);
          setDates(Array.from(dateSet)); // Establecer las fechas únicas
          setHours(Array.from(hoursSet)); // Establecer las horas únicas
        };
        
  };

        request();

  }, [owm, selectedDate] )


  
  const handleDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedDate(event.target.value as string);
  };

  const handleHourChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedHour(event.target.value as string);
  };




  let renderIndicators = () => {

    return indicators
            .map(
                (indicator, idx) => (
                    <Grid key={idx} size={{ xs: 12, xl: 3 }}>
                        <IndicatorWeather 
                            title={indicator["title"]} 
                            subtitle={indicator["subtitle"]} 
                            value={indicator["value"]} />
                    </Grid>
                )
            )
}
//Filtros
const filteredItems = selectedDate
  ? items.filter((item) => item.dateStart?.startsWith(selectedDate))
  : items;

  const filteredHours = filteredItems.map((item) => {
    const datePart = item.dateStart?.split('T')[0] || ""; // Fecha
    const hourPart = item.dateStart?.split('T')[1] || ""; // Hora
    return `${datePart} ${hourPart}`; // Combina fecha y hora
  });
  
  //Grafico 
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

    setTemperature(tempArray);
    setHumidity(humidityArray);
    setHours(hoursArray);
  }, [filteredItems, selectedHour]);

   {/* JSX */}
   console.log("Datos validados para el gráfico:", filteredItems);
   return (
    <>
      <HeaderWeather />
      <Grid container spacing={5}>
        {renderIndicators()}

        {/* Tabla */}
        <Grid size={{ xs: 12, xl: 8 }}>
          {/* Grid Anidado */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, xl: 3 }}>

              <ControlWeather
                dates={dates} // Pasar las fechas disponibles al componente de control
                hours={hours} // Pasar las horas disponibles por día
                onDateChange={handleDateChange}
                onHourChange={handleHourChange}
                />

</Grid>
            <Grid size={{ xs: 12, xl: 9 }}>
              <TableWeather itemsIn={filteredItems} />
            </Grid>
          </Grid>
        </Grid>
                
        {/* Gráfico */}
        <Grid size={{ xs: 12, xl: 4 }}>
          {" "}
          {selectedDate}
          <LineChartWeather itemsIn={filteredItems} />

        </Grid>
      </Grid>
    </>
  );
}

export default App;
