import React, {useCallback, useEffect, useRef, useState} from 'react'
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
    CardContent, Button, Stack
} from "@mui/material";
import Earth3D from "../../components/Earth";
import AutoSizer from "lp-react-virtualized-auto-sizer-react-18";
import {color as d3color} from 'd3';
import EventTable from "../../components/EventTable";
import DetailCard from "../../components/DetailCard";
import SearchField from "../../components/SearchBar";
import UndoRedo from "../../containers/UndoRedo";
import {useDispatch, useSelector} from "react-redux";
import {
    setFilter,
    setFilters,
    selectFilters
} from "../../reducer/streamfilters";
import {semicolor} from "../../containers/LayoutContainer/theme";
import {useQuestions} from "material-ui-shell/lib/providers/Dialogs/Question";
import {SET_MENU} from "../../reducer/actions/setting";

const LandingPage = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const {openDialog,closeDialog, setProcessing} = useQuestions()
    const filters = useSelector(selectFilters);
    // const { appConfig } = useConfig()
    const {getList,isLoading,getEvents,requestEvents,getDetail} = useDatabase();
    const [currentDetail,setCurrentDetail] = useState();
    const [zoomLoc,setZoomLoc] = useState();
    const legendRef = useRef(null);


    useEffect(()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                setZoomLoc({lng:position.coords.longitude,lat:position.coords.latitude})
            }, ()=>{});
        }
        dispatch({ type: SET_MENU, opened: true });
    },[]);

    const isLoadingInit = isLoading('rawData');
    const isLoadingEvent = isLoading('events');
    const isLoadingLocs = isLoading('locs');
    useEffect(()=>{
        if (!isLoadingInit) {
            requestEvents(filters, 1000)
        }
    },[isLoadingInit,filters])
    const onSelectStream = useCallback(({stream_detail_id})=>{
        const result = getDetail(stream_detail_id);
        setCurrentDetail(result);
        setZoomLoc({lng:result.long,lat:result.lat})
    },[getEvents])

    const onSelect = (value,extra)=>{
        if (extra)
            setZoomLoc({lng:extra.long,lat:extra.lat})
        dispatch(setFilters({value}));
    }

    return (<Page appBarContent={<>
        {/*<SearchField/>*/}
            <UndoRedo/>
        </>
    }>
            <div style={{position:'absolute',top:0,left:0, zIndex:0, height: '100%', width: '100%', overflow:'hidden'}}>
                <AutoSizer style={{ height: '100%', width: '100%' }} >
                    {({ height, width }) => {
                        return <Earth3D locs={getList('locs')} countries={getList('countries')}
                                        onSelect={onSelect}
                                        width={width} height={height}
                                        legendHolderRef={legendRef}
                                        zoomLoc={zoomLoc}
                        />
                    }}
                </AutoSizer>
            </div>
        <Grid container sx={{height:'100%', position:'relative', pointerEvents:'none'}} direction={"column"} justifyContent="space-between">
            <Grid >
                <Stack
                    m={1}
                    ref={legendRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        maxHeight:'30vh',
                        overflowY:'auto'
                    }}
                >

                </Stack>
                {/*<Button color={'secondary'}>Station Map</Button>*/}
            </Grid>
            <Grid container spacing={2} m={0} sx={{pointerEvents:'auto',maxHeight: 450}} alignItems={'end'}>
                <Grid item xs={8}>
                    <Card sx={{ minHeight: 275, backgroundColor:(theme)=> semicolor(theme.palette.background.paper)}}>
                        <CardContent>
                            <Typography>Event list</Typography>
                            <EventTable data={getEvents()} onSelectRow={onSelectStream} highlightId={currentDetail}/>
                        </CardContent>
                    </Card>
                </Grid>
                {currentDetail&&<Grid item xs={4} sx={{height:'100%'}}>
                    <Card sx={{height:'100%', backgroundColor: (theme) => semicolor(theme.palette.background.paper)}}>
                        <CardContent sx={{height:'100%'}}>
                            {/*<Typography>Event detail</Typography>*/}
                            <DetailCard data={currentDetail} onSelect={onSelect}/>
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