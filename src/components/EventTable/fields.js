import moment from "moment/moment";
import {Checkbox} from "@mui/material";
import EventOutIcon from '@mui/icons-material/ShoppingCartCheckout';
import EventIcon from '@mui/icons-material/ShoppingCart';
export const fields = [
    {
        id: 'inBasket',
        header: 'Selected',
        accessorKey: 'inBasket',
        // size: 50,
        Cell: ({ renderedCellValue, row }) => (
            <Checkbox
                disabled
                size={"small"}
                icon={<EventOutIcon />}
                checkedIcon={<EventIcon color={'secondary'}/>}
                checked={row.original.inBasket}
            />
        ),
        size: 50,
        minSize: 50,
        filterDisable:true,
    },
    {
        accessorKey: 'city',
        header: 'City',
    },
    {
        accessorKey: 'country',
        header: 'Country',
    },
    {
        accessorKey: 'station',
        header: 'Station',
        filterDisable:true
    },
    {
        accessorKey: 'station_genre',
        header: 'Station Genre',
        Cell: ({ renderedCellValue, row }) => (
            <>{(renderedCellValue??[]).join(', ')}</>
        ),
    },
    {
        accessorKey: 'artist_name',
        header: 'Artist',
        dynamic:true,
    },
    {
        accessorKey: 'track_name',
        header: 'Song',
        dynamic:true,
    }
    // ,
    // {
    //     accessorKey: 'time_station',
    //     header: 'Time',
    //     type:'time',
    //     filterDisable:true,
    //     accessorFn:(d)=>d.time_station?moment(d.time_station).format('LLL'):''
    // }
];
export const fieldsWithoutSelected = fields.filter((d,i)=>i);
export const filterSearch = fields.filter(f=>!f.filterDisable);