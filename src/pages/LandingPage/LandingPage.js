import React, {useCallback, useEffect, useState} from 'react'
import { useIntl } from 'react-intl'
import Page from "../../containers/Page/Page";
import {useDatabase} from "../../Providers/Database";
import {
    Backdrop,
    Box,
    Unstable_Grid2 as Grid,
    LinearProgress,
    Paper,
    Typography,
    Card,
    CardContent, Button
} from "@mui/material";
import Earth3D from "../../components/Earth";
import AutoSizer from "lp-react-virtualized-auto-sizer-react-18";
import {color as d3color} from 'd3';
import EventTable from "../../components/EventTable";
import DetailCard from "../../components/DetailCard";
import SearchField from "../../components/SearchBar";

const LandingPage = () => {
    const intl = useIntl()
    // const { appConfig } = useConfig()
    const {getList,isLoading,getEvents,getDetail} = useDatabase();
    const [currentDetail,setCurrentDetail] = useState();

    useEffect(()=>{
    },[]);

    const isLoadingInit = isLoading('rawData');
    const isLoadingEvent = isLoading('events');
    const isLoadingLocs = isLoading('locs');

    const onSelectStream = useCallback(({stream_detail_id})=>{
        const result = getDetail(stream_detail_id);
        setCurrentDetail(result);
    },[getEvents])

    return (<Page appBarContent={<SearchField/>}>
            <div style={{position:'absolute',top:0,left:0, zIndex:0, height: '100%', width: '100%', overflow:'hidden'}}>
                <AutoSizer style={{ height: '100%', width: '100%' }} >
                    {({ height, width }) => {
                        return <Earth3D locs={getList('locs')} countries={getList('countries')} width={width} height={height}/>
                    }}
                </AutoSizer>
            </div>
        <Grid container sx={{height:'100%', position:'relative', pointerEvents:'none'}} direction={"column"} justifyContent="space-between">
            <Grid  sx={{pointerEvents:'none'}}><Button color={'secondary'}>Zone 1</Button></Grid>
            <Grid container spacing={2} m={0} sx={{pointerEvents:'auto'}}>
                <Grid item xs={8}>
                    <Card sx={{ minHeight: 275, backgroundColor:(theme)=> semicolor(theme.palette.background.paper)}}>
                        <CardContent>
                            <Typography>Event list</Typography>
                            <EventTable data={getEvents(1000)} onSelectRow={onSelectStream}/>
                        </CardContent>
                    </Card>
                </Grid>
                {currentDetail&&<Grid item xs={4}>
                    <Card sx={{minHeight: 275, backgroundColor: (theme) => semicolor(theme.palette.background.paper)}}>
                        <CardContent>
                            {/*<Typography>Event detail</Typography>*/}
                            <DetailCard data={currentDetail}/>
                        </CardContent>
                    </Card>
                </Grid>}
            </Grid>
        </Grid>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={(isLoadingInit||isLoadingLocs)}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', width:'50%', flexDirection: "column", textAlign:'center' }}>
                <Box sx={{ width: '100%' }}>
                    <LinearProgress variant="determinate" value={(isLoadingInit)?40:((isLoadingLocs)?90:100)} />
                </Box>
                <Box sx={{ width: '100%' }}>
                    <h2>{(isLoadingInit)?'Read data....':((isLoadingLocs)?'Process data...':'Done!')}</h2>
                </Box>
            </Box>
        </Backdrop>
    </Page>
    )
}

export default LandingPage;

function semicolor(_color){
    const color = d3color(_color);
    color.opacity = 0.5
    return color.toString();
}