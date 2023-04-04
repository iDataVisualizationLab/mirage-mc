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
    CardContent, Button, Stack, IconButton, Collapse
} from "@mui/material";
import Earth3D from "../../components/Earth";
import AutoSizer from "lp-react-virtualized-auto-sizer-react-18";

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
import MinimizeIcon from '@mui/icons-material/Minimize';
import EventDetail from "../../components/EventDetail";

const LandingPage = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const {openDialog,closeDialog, setProcessing} = useQuestions()
    const filters = useSelector(selectFilters);
    // const { appConfig } = useConfig()
    const {getList,isLoading,getEvents,requestEvents,requestDetail,getDetail} = useDatabase();
    const [zoomLoc,setZoomLoc] = useState();
    const [openEventList,setOpenEventList] = useState(true);
    const legendRef = useRef(null);
    const toolbarRef = useRef(null);

    const currentDetail = getDetail();
    useEffect(()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                setZoomLoc({lng:position.coords.longitude,lat:position.coords.latitude})
            }, ()=>{});
        }
        dispatch({ type: SET_MENU, opened: true });
    },[]);

    useEffect(()=>{
        if(currentDetail)
            setZoomLoc({lng:currentDetail.long,lat:currentDetail.lat})
    },[currentDetail])

    const isLoadingInit = isLoading('rawData');
    const isLoadingEvent = isLoading('events');
    const isLoadingLocs = isLoading('locs');
    useEffect(()=>{
        if (!isLoadingInit) {
            requestEvents(filters, 1000)
        }
    },[isLoadingInit,filters])
    const onSelectStream = useCallback((data)=>{
        requestDetail(data);
    },[getEvents])

    const onSelect = (value,extra)=>{
        if (extra)
            setZoomLoc({lng:extra.long,lat:extra.lat})
        dispatch(setFilters({value}));
    }

    const onTogleEventList = useCallback(()=>{
        setOpenEventList(!openEventList);
    },[openEventList])

    return (<Page appBarContent={<>
        {/*<SearchField/>*/}
            <div ref={toolbarRef}></div>
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
                                        toolbarRef={toolbarRef}
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
                        right: 0,
                        maxHeight:'30vh',
                        overflowY:'auto'
                    }}
                >

                </Stack>
                {/*<Button color={'secondary'}>Station Map</Button>*/}
            </Grid>
            <Grid container spacing={2} m={0} sx={{pointerEvents:'none'}} alignItems={'end'}>
                <Grid item xs={8} sx={{pointerEvents:'all'}}>
                    <Card sx={{  maxWidth:openEventList?undefined:200, backgroundColor:(theme)=> semicolor(theme.palette.background.paper)}}>
                        <CardContent sx={{position:'relative'}}>
                            <Typography>Event List</Typography>
                            <IconButton
                                aria-label="close"
                                onClick={onTogleEventList}
                                sx={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                }}
                            >
                                <MinimizeIcon />
                            </IconButton>
                            <Collapse in={openEventList} timeout="auto">
                                <div style={{height:350}}>
                                    <EventTable data={getEvents()} isLoadingData={isLoadingEvent} onSelectRow={onSelectStream} highlightId={currentDetail}/>
                                </div>
                            </Collapse>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} sx={{pointerEvents:'all'}}>
                    <EventDetail currentDetail={currentDetail} onSelect={onSelect}
                                 events={getEvents()}
                                 locs={getList('locs')}
                                 sx={{float:'right'}}/>
                </Grid>
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