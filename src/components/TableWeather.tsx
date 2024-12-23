import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from '../interface/item';
import { useEffect, useState } from "react";

interface MyProp {
    itemsIn: Item[];
    selectedDate: string;
    selectedHour: string;
  }

export default function BasicTable(props: MyProp) {
    const { itemsIn, selectedDate, selectedHour} = props;
    const [, setFilteredRows] = useState<Item[]>([]);
    
    useEffect(() => {
    if (selectedDate) {
        const filteredRows = itemsIn;
        setFilteredRows(filteredRows);
    } 
     },  [itemsIn, selectedDate, selectedHour]);

return (
<TableContainer component={Paper}>
    <Table aria-label="simple table">
    <TableHead>
        <TableRow>
        <TableCell> Hora de inicio</TableCell>
        <TableCell align="right"> Hora de fin</TableCell>
        <TableCell align="right">Precipitacion</TableCell>
        <TableCell align="right"> Humedad</TableCell>
        <TableCell align="right">Nubosidad</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {itemsIn.map((row, idx) => (
        <TableRow
            key={idx}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" scope="row">
            {row.dateStart}
            </TableCell>
            <TableCell align="right">{row.dateStart}</TableCell>
            <TableCell align="right">{row.precipitation}</TableCell>
            <TableCell align="right">{row.humidity}</TableCell>
            <TableCell align="right">{row.clouds}</TableCell>
        </TableRow>
        ))}
    </TableBody>
    </Table>
</TableContainer>
);
}