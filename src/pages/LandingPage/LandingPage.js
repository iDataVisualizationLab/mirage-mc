import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
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

import EventTable from "../../components/EventTable/index";
import { Responsive as ResponsiveGridLayout, WidthProvider } from "react-grid-layout";
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
import useQuery from "../../Providers/Query";
import * as FlexLayout from "flexlayout-react";
import "./layout.css";
import {AddCircle} from "@mui/icons-material";
import EventMap from "../../components/EventMap";




const LandingPage = () => {
    // const ResponsiveGridLayout = useMemo(()=>WidthProvider(Responsive),[]);
    const dispatch = useDispatch();
    const intl = useIntl();
    // const {openDialog,closeDialog, setProcessing} = useQuestions()
    const filters = useSelector(selectFilters);
    // const { appConfig } = useConfig()
    const {getList,isLoading,getEvents,requestEvents,requestDetail,getDetail,setFuncCollection} = useDatabase();
    const [zoomLoc,setZoomLoc] = useState();
    const [layoutItems,setLayoutItems] = useState({eventList:true,eventDetail:true,eventMap:true});
    const toolbarRef = useRef(null);
    const currentDetail = getDetail();
    const query = useQuery();
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

    const onSelect = useCallback((value,extra)=>{
        if (extra)
            setZoomLoc({lng:extra.long,lat:extra.lat})
        dispatch(setFilters({value}));
    },[]);

    // const onTogleWin = useCallback((key)=>{
    //     setLayoutItems({...layoutItems,[key]:!layoutItems[key]});
    // },[layoutItems])

    // const generateLayout = (k)=>{
    //     switch (k){
    //         case 'eventList':
    //             return <EventTable data={getEvents()}
    //                                isLoadingData={isLoadingEvent}
    //                                onSelectRow={onSelectStream}
    //                                highlightId={currentDetail}
    //                                onTogleWin={()=>onTogleWin("eventList")}
    //             />
    //         case 'eventDetail':
    //             return <EventDetail currentDetail={currentDetail} onSelect={onSelect}
    //                                 events={getEvents()}
    //                                 locs={getList('locs')}
    //                                 sx={{height:'100%',position:'relative'}}
    //                                 onTogleWin={()=>onTogleWin("eventDetail")}
    //             />
    //         default:
    //             return ''
    //     }
    // }

    const [layouts,setLayouts] = useState(()=>FlexLayout.Model.fromJson({
        global: {
            // "splitterSize": 1,
            // "splitterExtra": 4,
            "tabEnableFloat": true,
            "tabSetMinWidth": 100,
            "tabSetMinHeight": 100,
            "borderMinSize": 100
        },
        borders:[
            {
                "type": "border",
                "location":"top",
                "size": 400,
                "active": true,
                "children": [
                ]
            },
            {
                "type": "border",
                "location":"left",
                "size": 500,
                "children": [
                    {
                        "type": "tab",
                        "name": "Earth View",
                        enableClose: false,
                        "component": "Earth"
                    }
                ],
                "selected": 0,
            }
        ],
        layout: {
            type: "row",
            weight: 100,
            children: [
                {"type": "row",
                    children: [
                        {
                            type: "tabset",
                            weight: 50,
                            children: [
                                {
                                    type: "tab",
                                    name: "Song List",
                                    component: "eventList",
                                }
                            ]
                        },
                        {
                            type: "tabset",
                            weight: 50,
                            children: [
                                {
                                    type: "tab",
                                    name: "Map",
                                    component: "eventMap",
                                },{
                                    type: "tab",
                                    name: "Song Detail",
                                    component: "eventDetail",
                                }
                            ]
                        }
                        ]
                }
            ]
        }
    }));

    const factory = (node) => {
        let component = node.getComponent();
        switch (component){
            case 'eventList':
                return <EventTable data={getEvents()}
                                   isLoadingData={isLoadingEvent}
                                   onSelectRow={onSelectStream}
                                   highlightId={currentDetail}
                                   // onTogleWin={()=>onTogleWin("eventList")}
                />
            case 'eventMap':
                return <EventMap
                    currentDetail={currentDetail}
                    events={getEvents()}
                    locs={getList('locs')}
                />
            case 'eventDetail':
                return <EventDetail currentDetail={currentDetail} onSelect={onSelect}
                                    events={getEvents()}
                                    locs={getList('locs')}
                                    sx={{height:'100%',position:'relative'}}
                                    // onTogleWin={()=>onTogleWin("eventDetail")}
                />
            case 'Earth':
                return <AutoSizer style={{ height: '100%', width: '100%' }} >
                    {({ height, width }) => {
                        return <Earth3D locs={getList('locs')}
                                        countries={getList('countries')}
                                        onSelect={onSelect}
                                        onSelectLegend={setFuncCollection}
                                        width={width} height={height}
                                        toolbarRef={toolbarRef}
                                        zoomLoc={zoomLoc}
                        />
                    }}
                </AutoSizer>
            default:
                return ''
        }
    }
    const onRenderTabSet = (tabSetNode, renderValues) =>{
        if (Object.keys(layoutItems).reduce((pre,k)=>pre || (layoutItems[k]===false),false)) {
            renderValues.stickyButtons.push(<AddCircle
                title= "Add"
                key= "Add button"
                className={"flexlayout__tab_toolbar_button"}
                style={{width: "1.1em", height: "1.1em"}}
            />)
            // renderValues.stickyButtons.push(React.createElement("img", {
            //     src: "images/add.svg",
            //     alt: "Add",
            //     key: "Add button",
            //     title: "Add Tab (using onRenderTabSet callback, see Demo)",
            //     style: {width: "1.1em", height: "1.1em"},
            //     className: "flexlayout__tab_toolbar_button",
            //     // onClick: function () { return _this.onAddFromTabSetButton(node); }
            // }));
        }
    }

    return (<Page appBarContent={<>
        {/*<SearchField/>*/}
        {/*    <div>*/}
        {/*        {*/}
        {/*            Object.keys(layoutItems).map(k=>layoutItems[k]?'':<div key={`plugin-${k}`}*/}
        {/*            onClick={()=>onTogleWin(k)}>*/}
        {/*                <Button>{k}</Button>*/}
        {/*            </div>)*/}
        {/*        }*/}
        {/*    </div>*/}
            <div ref={toolbarRef}></div>
            <UndoRedo/>
        </>
    }>
            {/*<div style={{position:'absolute',top:0,left:0, zIndex:0, height: '100%', width: '100%', overflow:'hidden'}}>*/}
            {/*    <AutoSizer style={{ height: 'calc(100vh - 64px)', width: '100%' }} >*/}
            {/*        {({ height, width }) => {*/}
            {/*            return <Earth3D locs={getList('locs')}*/}
            {/*                            countries={getList('countries')}*/}
            {/*                            onSelect={onSelect}*/}
            {/*                            onSelectLegend={setFuncCollection}*/}
            {/*                            width={width} height={height}*/}
            {/*                            toolbarRef={toolbarRef}*/}
            {/*                            zoomLoc={zoomLoc}*/}
            {/*            />*/}
            {/*        }}*/}
            {/*    </AutoSizer>*/}
            {/*</div>*/}
        <div style={{height: '100%', position:'relative', pointerEvents:'all', overflow:'hidden'}}>
            <FlexLayout.Layout model={layouts}
                               factory={factory}
                               onRenderTabSet={onRenderTabSet}
                               onModelChange={(m)=>{
                                   // check tab
                                   Object.keys(layoutItems).forEach(k=>layoutItems[k]=false);
                                   m._root._children.forEach(m=>m._children.forEach(m=>layoutItems[m._attributes.component]=true))
                                   setLayoutItems(layoutItems)
                               }}
            />

            {/*<AutoSizer style={{ minHeight: '100%', width: '100%', position:'relative' }} >*/}
            {/*    {({ height, width }) => {*/}
            {/*        return <ResponsiveGridLayout className="layout" cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}*/}
            {/*                      layouts={layouts}*/}
            {/*                     onBreakpointChange={onBreakpointChange}*/}
            {/*                     onLayoutChange={onLayoutChange}*/}
            {/*                      preventCollision={true}*/}
            {/*                      compactType={null}*/}
            {/*                      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}*/}
            {/*                     margin={{ lg: [10,10], md: [10,10], sm: [10,10], xs: [10,10], xxs: [10,10] }}*/}
            {/*                         width={width}*/}
            {/*                         rowHeight={(height-20)/10 -10}*/}
            {/*                         height={height}*/}
            {/*                      style={{position:'relative',height:height, pointerEvents:'all'}} >*/}
            {/*            {*/}
            {/*                Object.keys(layoutItems).map(k=>layoutItems[k]?<div key={k} style={{pointerEvents:'all'}}>*/}
            {/*                    {generateLayout(k)}*/}
            {/*                </div>:'')*/}
            {/*            }*/}
            {/*</ResponsiveGridLayout>}}*/}
            {/*</AutoSizer>*/}
        </div>
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