import moment from "moment/moment";
export const fields = [
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
    },
    {
        accessorKey: 'station_genre',
        header: 'Station Genre',
    },
    {
        accessorKey: 'stream_artist',
        header: 'Artist',
        dynamic:true,
    },
    {
        accessorKey: 'stream_song',
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

export const filterSearch = fields.filter(f=>!f.filterDisable);