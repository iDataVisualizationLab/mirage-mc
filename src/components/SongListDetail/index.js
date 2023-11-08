import LegendPanel from "../LegendPanel";
import React from "react";
import {Grid} from "@mui/material";

export default function ({countries}) {
    return <Grid sx={{position:'relative',height:'100%'}}>
        <LegendPanel countries={countries} fullHeight={true}/>
    </Grid>
}