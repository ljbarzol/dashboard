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
  onDateChange: (event: SelectChangeEvent) => void;
}

export default function ControlWeather({
  dates,
  onDateChange,
}: ControlWeatherProps) {
  {/* Constante de referencia a un elemento HTML */ }
  const descriptionRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleDateChange = (event: SelectChangeEvent) => {
    setSelectedDate(event.target.value);
    onDateChange(event); 
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

      <Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />
    </Paper>
  );
}
