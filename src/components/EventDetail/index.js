import {
    Box,
    Card,
    CardContent,
    Collapse,
    IconButton, Paper,
    Tab,
    Tabs,
    Typography,
    Unstable_Grid2 as Grid
} from "@mui/material";
import {semicolor} from "../../containers/LayoutContainer/theme";
import MinimizeIcon from "@mui/icons-material/Minimize";
import DetailCard from "../DetailCard";
import {useCallback,useState} from "react";
import PropTypes from "prop-types";
import Map from "../Map";
import AutoSizer from "lp-react-virtualized-auto-sizer-react-18";

export default function ({currentDetail,locs,onSelect,sx={}}) {
    const [openEventList,setOpenEventList] = useState(true);
    const [valueTab, setValueTab] = useState(0);

    const handleChangeTab = (event, newValueTab) => {
        setValueTab(newValueTab);
    };

    const onTogleEventList = useCallback(()=>{
        setOpenEventList(!openEventList);
    },[openEventList])

    return (
        <Card sx={{...sx,width:openEventList?'100%':200, backgroundColor: (theme) => semicolor(theme.palette.background.paper)}}>
            <CardContent sx={{height: '100%', position: 'relative'}}>
                <Typography>Event detail</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onTogleEventList}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                    }}
                >
                    <MinimizeIcon/>
                </IconButton>
                <Collapse in={openEventList} timeout="auto">
                    <Grid container style={{height:350, width:'100%'}} m={0} flexDirection={"column"} flexWrap={'nowrap'}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={valueTab} onChange={handleChangeTab} aria-label="basic tabs example">
                                <Tab label="Map" {...a11yProps(0)} />
                                <Tab label="Event Info" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        {/*<Grid item sx={{height:'100%'}} flexGrow={2}>*/}
                        {/*{(valueTab === 0)?<Map/>:''}*/}
                            <TabPanel value={valueTab} index={0} sx={{height:'100%'}}>
                                <CardContent style={{margin:'auto',display: 'block', maxWidth:'100%',height:'100%',padding:0}}>
                                    <AutoSizer style={{ height: '100%', width: '100%' }} >
                                        {({ height, width }) => {
                                            return <Map height={height} width={width} locs={locs} highlight={currentDetail}/>
                                        }}
                                    </AutoSizer>
                                </CardContent>
                            </TabPanel>
                            <TabPanel value={valueTab} index={1} style={{height:'100%',overflowY:'auto'}}>
                                {(valueTab === 1)&&<CardContent sx={{width:'100%'}}>{currentDetail ?
                                    <DetailCard data={currentDetail} onSelect={onSelect}/> : <>Select from Event
                                        List</>}
                                </CardContent>}
                            </TabPanel>
                        {/*</Grid>*/}
                    </Grid>
                </Collapse>
            </CardContent>
        </Card>
    )
}

function a11yProps(index) {
    return {
        id: `event-tab-${index}`,
        'aria-controls': `event-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Card
            role="tabpanel"
            hidden={value !== index}
            id={`event-tabpanel-${index}`}
            aria-labelledby={`event-tab-${index}`}
            {...other}
        >
            {value === index && (<>
                    {children}
            </>)}
        </Card>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
