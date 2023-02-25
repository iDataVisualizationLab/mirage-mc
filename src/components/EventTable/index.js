import React, { useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import Scrollbar from "material-ui-shell/lib/components/Scrollbar";
import {fields} from "./fields";
import {Box, Button} from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import {useDatabase} from "../../Providers/Database";




const EventTable = ({data,isLoadingData,onSelectRow,highlightId}) => {
    const columns = fields;

    //optionally access the underlying virtualizer instance
    const rowVirtualizerInstanceRef = useRef(null);

    // const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sorting, setSorting] = useState([]);
    const {getDownloadData} = useDatabase();

    useEffect(() => {
        //scroll to the top of the table when the sorting changes
        rowVirtualizerInstanceRef.current?.scrollToIndex(0);
    }, [sorting]);


    const handleExportRows = (rows) => {
        setIsLoading(true)
        getDownloadData(rows.map((row) => row.original)).then((datadownload)=>{
            const csvOptions = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                filename: `mirage-mc-${new Date().toDateString()}`,
                useBom: true,
                useKeysAsHeaders: true,
                // headers: fields.map((c) => c.accessorKey),
            };
            const csvExporter = new ExportToCsv(csvOptions);
            csvExporter.generateCsv(datadownload);
            setIsLoading(false)
        }).catch(e=>{
            setIsLoading(false)
        })
    };
    const handleExportData = () => {
        setIsLoading(true)
        // csvExporter.generateCsv(data);
        const datadownload = getDownloadData();
        const csvOptions = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            filename: 'mirage-mc-all',
            useBom: true,
            useKeysAsHeaders: true,
            // headers: fields.map((c) => c.accessorKey),
        };
        const csvExporter = new ExportToCsv(csvOptions);
        csvExporter.generateCsv(datadownload);
        setIsLoading(false)
    };

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
            state={{ isLoading:isLoadingData||isLoading, sorting }}
            rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //optional
            rowVirtualizerProps={{ overscan: 8 }} //optionally customize the virtualizer
            muiTableBodyRowProps={({ row }) => ({
                onClick: ()=>{onSelectRow(row.original)},
                sx: { cursor: 'pointer',opacity:highlightId?(highlightId.stream_detail_id=== row.original.stream_detail_id?1:0.7):1},
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
            renderTopToolbarCustomActions={({ table }) => (
                <Box
                    sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                >
                    <Button
                        color="primary"
                        target={"_blank"}
                        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                        // onClick={handleExportData}
                        href={process.env.REACT_APP_DATA_DOWNLOAD}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                    >
                        Download All Data
                    </Button>
                    <Button
                        disabled={table.getPrePaginationRowModel().rows.length === 0}
                        //export all rows, including from the next page, (still respects filtering and sorting)
                        onClick={() =>
                            handleExportRows(table.getPrePaginationRowModel().rows)
                        }
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                    >
                        Export Current Data
                    </Button>
                    {/*<Button*/}
                    {/*    disabled={table.getRowModel().rows.length === 0}*/}
                    {/*    //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)*/}
                    {/*    onClick={() => handleExportRows(table.getRowModel().rows)}*/}
                    {/*    startIcon={<FileDownloadIcon />}*/}
                    {/*    variant="contained"*/}
                    {/*>*/}
                    {/*    Export Page Rows*/}
                    {/*</Button>*/}
                    {/*<Button*/}
                    {/*    disabled={*/}
                    {/*        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()*/}
                    {/*    }*/}
                    {/*    //only export selected rows*/}
                    {/*    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}*/}
                    {/*    startIcon={<FileDownloadIcon />}*/}
                    {/*    variant="contained"*/}
                    {/*>*/}
                    {/*    Export Selected Rows*/}
                    {/*</Button>*/}
                </Box>
            )}
        />
    );
};

//virtualizerInstanceRef was renamed to rowVirtualizerInstanceRef in v1.5.0
//virtualizerProps was renamed to rowVirtualizerProps in v1.5.0

export default EventTable;