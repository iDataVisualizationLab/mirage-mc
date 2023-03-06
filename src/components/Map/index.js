import Plot from 'react-plotly.js';
import {useTheme} from "@mui/material/styles";
import {useEffect, useState} from "react";
import {color as d3color, extent, scaleLinear} from 'd3';
import './index.css';

const countriesScale = scaleLinear().range([5,20]);
export default function  Map ({locs,height,width,highlight}) {
    const theme = useTheme();
    let [data,setData] = useState([]);
    useEffect(()=>{
        // const botColor = d3color(theme.palette.text.primary);
        // botColor.opacity = highlight?0.5:1;
        const _botColor = theme.palette.text.primary;
        countriesScale.domain(extent(locs,d=>d?.count));
        let lon=[];
        let lat=[];
        let size=[];
        let text=[];
        // let color=[];
        locs.forEach(d=>{
            lon.push(d.long)
            lat.push(d.lat)
            size.push(countriesScale(d?.count))
            text.push(`${d['title']} (${d?.count})`);
            // color.push((highlight&&(highlight.country===d['title']))? 'red':_botColor);
        });
        // console.log(highlight,color)
        let ticks = countriesScale.ticks(3);
        let tsize = ticks.map(t=>countriesScale(t));
        let tickS = ticks.map((t,i)=>({
            geo: 'geo3',
            type: 'scattergeo',
            mode: 'markers',
            name:`${t}`,
            lon:[0],
            lat:[0],
            x: [0],
            y: [0],
            marker: {
                color: theme.palette.text.primary,
                size: tsize[i]
            },
            // xaxis: 'x2',
            // yaxis: 'y2',
            visible: 'legendonly'
        }))
        let data = [{
            geo: 'geo3',
            type: 'scattergeo',
            mode: 'markers',
            locationmode: 'world',
            lon,
            lat,
            hoverinfo:  'text',
            text,
            showlegend: false,
            marker: {
                size,
                color:_botColor,
                // cmin: 0,
                // cmax: 50,
                // colorscale: [
                //     ['0.0', theme.palette.secondary.light],
                //     ['1.0', theme.palette.primary.main]
                // ],
                // colorbar: {
                //     title: '#Streams',
                //     thickness: 10,
                //     // ticksuffix: '%',
                //     showticksuffix: 'last',
                //     x: 1,
                //     xanchor: 'right',
                //     yanchor: 'top',
                //     orientation: 'h'
                //     // y: 0
                // },

                line: {
                    color: 'black'
                }
            }
        },...tickS
        ];
        if (highlight) {
            const _highlight = locs.find(d => d['title'] === highlight.country);
            if (_highlight) {
                data.push({
                    geo: 'geo3',
                    type: 'scattergeo',
                    mode: 'markers',
                    locationmode: 'world',
                    lon: [_highlight.long],
                    lat: [_highlight.lat],
                    hoverinfo: 'text',
                    text: [_highlight.country],
                    showlegend: true,
                    marker: {
                        size:[countriesScale(_highlight.count)],
                        color: 'red',
                        line: {
                            color: 'black'
                        }
                    },
                    name: _highlight['title']
                })
            }
        }
        setData(data);
    },[locs,highlight])

    let layout = {
        paper_bgcolor:theme.palette.background.paper,
        plot_bgcolor:'rgba(0,0,0,0)',//theme.palette.background.paper,
        autoscale: false,
        height:height,
        width:width,
        margin:{t:10,r:10,l:10,b:10},
        'geo3': {
            // scope: highlight?highlight.country.toLowerCase():'world',
            bgcolor:'rgba(0,0,0,0)',
            showland: true,
            landcolor: theme.palette.primary.main,//'rgb(217, 217, 217)',
            showframe: false
            // 'resolution': 50
        },
        // grid: {rows: 2, columns: 1, pattern: 'independent'},
        font: {
            family: theme.typography.fontFamily,
            size: theme.typography.fontSize,
            color: theme.palette.text.primary
        },
        legend: {
            title: {text: '#Station'},
            // ticksuffix: '%',
            showticksuffix: 'last',
            x: 1,
            xanchor: 'right',
            y: 0,
            orientation: 'h'
        },
        // annotations: highlight?[{
        //     // x: highlight.long,
        //     // y: highlight.lat,
        //     xref: 'lonaxis',
        //     yref: 'lataxis',
        //     arrowhead: 6,
        //     ax: 0,
        //     ay: -80,
        //     bgcolor: 'rgba(255, 255, 255, 0.9)',
        //     arrowcolor: 'red',
        //     font: {size:12},
        //     bordercolor: 'red',
        //     borderwidth: 3,
        //     borderpad: 4,
        //     text: `${highlight.country}`
        // }]:[]
    };
    return (
        <Plot
            data={data}
            layout={ layout }
            config = {{'displaylogo': false,
                'toImageButtonOptions': {
                'format': 'svg',//one of png, svg, jpeg, webp 'svg'
                'filename': 'Station_Map',
                'height': 1080,
                'width': 1920,
                'scale': 1// # Multiply title/legend/axis/canvas sizes by this factor
                },
                showEditInChartStudio: true,
                plotlyServerURL: "https://chart-studio.plotly.com",
                '#Station':false
        }}
            divId={'Map'}
        />
    );
}