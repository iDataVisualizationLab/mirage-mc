import React, { useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import Scrollbar from "material-ui-shell/lib/components/Scrollbar";
import {fields} from "./fields";
const EventTable = ({data,onSelectRow}) => {
    const columns = fields;

    //optionally access the underlying virtualizer instance
    const rowVirtualizerInstanceRef = useRef(null);

    // const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sorting, setSorting] = useState([]);

    useEffect(() => {
        console.log('I have been call!!!')
    }, [data]);

    useEffect(() => {
        //scroll to the top of the table when the sorting changes
        rowVirtualizerInstanceRef.current?.scrollToIndex(0);
    }, [sorting]);

    return (
        <MaterialReactTable
            columns={columns}
            data={data} //10,000 rows
            enableBottomToolbar={false}
            enableGlobalFilterModes
            enableDensityToggle={false}
            enablePagination={false}
            // enableRowNumbers
            enableRowVirtualization
            muiTableContainerProps={{ sx: { maxHeight: '300px' } }}
            initialState={{ density: 'compact' }}
            onSortingChange={setSorting}
            state={{ isLoading, sorting }}
            rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //optional
            rowVirtualizerProps={{ overscan: 8 }} //optionally customize the virtualizer
            muiTableBodyRowProps={({ row }) => ({
                onClick: ()=>{onSelectRow(row.original)},
                sx: { cursor: 'pointer' },
            })}
            enableColumnResizing
            defaultColumn={{
                minSize: 20, //allow columns to get smaller than default
                maxSize: 9001, //allow columns to get larger than default
                size: 100, //make columns wider by default
            }}
            // muiTableBodyProps={{
            //     sx: {
            //         //stripe the rows, make odd rows a darker color
            //         '& tr': {
            //             backgroundColor: (theme)=> theme.mode == 'dark' ? 'rgba(0,0,0,0.58)' : 'rgba(255,255,255,0.76)',
            //         },
            //     },
            // }}
        />
    );
};

//virtualizerInstanceRef was renamed to rowVirtualizerInstanceRef in v1.5.0
//virtualizerProps was renamed to rowVirtualizerProps in v1.5.0

export default EventTable;