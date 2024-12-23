/* Hooks */
import { useState, useRef } from "react";

/* Componentes MUI */
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface ControlWeatherProps {
  dates: string[];
  hours: string[];  // Añadir 'hours' a las props
  onDateChange: (event: SelectChangeEvent) => void;
  onHourChange: (event: SelectChangeEvent) => void;
}

export default function ControlWeather({
  dates,
  hours,
  onDateChange,
  onHourChange
}: ControlWeatherProps) {
  {/* Constante de referencia a un elemento HTML */ }
  const descriptionRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleDateChange = (event: SelectChangeEvent) => {
    setSelectedDate(event.target.value);
    onDateChange(event); // Pasar el cambio de fecha al componente padre
  };

  const handleHourChange = (event: SelectChangeEvent) => {
    onHourChange(event); // Pasar el cambio de hora al componente padre
  };

  {/* JSX */}
  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="simple-select-label">Fecha</InputLabel>
          <Select
            labelId="date-select-label"
            value={selectedDate}
            onChange={handleDateChange}
            label="Fecha"
          >
            {dates.map((date, idx) => (
              <MenuItem key={idx} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ minWidth: 120, marginTop: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="simple-select-label">Hora</InputLabel>
          <Select
            labelId="hour-select-label"
            value=""
            onChange={handleHourChange}
            label="Hora"
          >
            {hours.map((hour, idx) => (
              <MenuItem key={idx} value={hour}>
                {hour}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />
    </Paper>
  );
}
