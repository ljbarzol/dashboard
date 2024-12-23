import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import Item from '../interface/item';

interface LineChartWeatherProps {
    itemsIn: Item[];
}
export default function LineChartWeather({ itemsIn }: LineChartWeatherProps) {
  const data = itemsIn.map(item => ({
    temperature: parseFloat(item.temperature) - 273.15, 
    humidity: item.humidity,
    hours: item.dateStart, 
  }));
  

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <LineChart
        width={400}
        height={250}
        series={[
          { data: data.map(d => d.temperature), label: 'Temperatura (°C)' },
          { data: data.map(d => parseFloat(d.humidity)), label: 'Humedad (%)' },
        ]}
        
      />
    </Paper>
  );
}
