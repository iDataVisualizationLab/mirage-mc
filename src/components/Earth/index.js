import React, {useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect} from 'react';
import Globe from 'react-globe.gl'
import * as d3 from 'd3'


const TOP = 20;
const colorArr = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];

const arcThickScale = d3.scaleLinear().range([0.01,0.7]);
const countriesScale = d3.scaleLinear().range([0.1,0.7]);




function Earth3D({locs,countries,width,height}) {
    const globeEl = useRef();
    const [colorKey, setColorKey] = useState('country');
    const [selectPoint, setSelectPoint] = useState();
    const [currentSequnce,setCurrentSequnce] = useState(0);
    const [MAP_CENTERs,setMAP_CENTERs] = useState([{ lat: -92.52824601944323, lng: 38.31079101844495, altitude: 1.8 },{ lat: 51.58421865, lng: 45.9571029, altitude: 1.8 },{ lat: 31.3037101, lng: -89.29276214, altitude: 1.8 },{ lat: 33.5842591, lng: -101.8804709, altitude: 1.8 }]);

    const colorsCategory = useMemo(()=>{
        return function(otherColor="#454545"){
            const scale = d3.scaleOrdinal(colorArr);
            let master = (val)=>{
                if ((!val)||(val==='')||(val.trim===''))
                    return 'black'
                const domain = scale.domain();
                if (domain.find(d=>d===val)|| (domain.length<TOP))
                    return scale(val);
                else
                    return otherColor
            };
            master.domain = scale.domain;
            master.range = scale.range;
            return master;
        }();
    },[]);

    function handleData({locs,countries}) {
        const range = d3.extent(locs, d => d.count);
        arcThickScale.domain(range);

        countriesScale.domain(d3.extent(countries, d => d.count));

        //color
        colorsCategory.domain([]).range(colorArr);
        countries.forEach(d=>colorsCategory(d.title));

        let order = 0;
        if (countries.length>3)
        [0,1,2,3,0].forEach(i=> {
            if (!MAP_CENTERs[order])
                MAP_CENTERs[order] = {lat:0,lng:0,altitude:1}
            MAP_CENTERs[order].lat = countries[i].lat;
            MAP_CENTERs[order].lng = countries[i].long;
            order++
        })
        return {MAP_CENTERs};
    }
    useEffect(() => {
        const {MAP_CENTERs} = handleData({locs,countries})
        setMAP_CENTERs(MAP_CENTERs);
        setCurrentSequnce(0);
    }, [locs,countries]);

    const [timer,setTimer] = useState(null);
    useEffect(()=>{
        if (globeEl.current) {
            if (currentSequnce < MAP_CENTERs.length) {

                const interval = setTimeout(() => {
                    globeEl.current.pointOfView(MAP_CENTERs[currentSequnce], 4000)
                    setCurrentSequnce(currentSequnce + 1);
                }, 4000);
                setTimer(interval);
                return () => {
                    clearInterval(interval);
                };
            }
        }
    },[currentSequnce,MAP_CENTERs])
    const stopPlay = useCallback(()=>{
        if (timer)
            clearInterval(timer);
        setCurrentSequnce(MAP_CENTERs.length);
    },[timer]);

    const zoomTo = useCallback((lng,lat)=>{
        if (globeEl.current) {
            stopPlay();
            globeEl.current.pointOfView({ lat, lng, altitude: 0.8 }, 2000);
        }
    },[currentSequnce,stopPlay])

    return  <div
        style={{
            background: "#000010",
            position: "relative"
        }}
    >
        <div style={{
            transform: "translate(0, -20%)",
            height: '100vh'
        }}>
            <Globe
                width={width}
                height={height}
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"

                labelsData={countries}
                labelLat={useCallback(d => d.lat,[])}
                labelLng={useCallback(d => d.long,[])}
                labelAltitude={useCallback(d=>(selectPoint&&(selectPoint['title']===d['title']))?0.15:0.1,[selectPoint])}
                labelText={useCallback(d => d['title'],[])}
                // labelSize={d => (selectPoint&&(selectPoint===d))?0.8:arcThickScale(d.count)/3}
                labelSize={useCallback(d => arcThickScale(d.count)/3,[])}
                labelDotRadius={0}
                labelColor={useCallback(d => (selectPoint&&(selectPoint['title']===d['title']))?('#dd6700'):(d.color??'white'),[selectPoint])}
                labelResolution={2}

                hexBinPointsData={locs}
                hexBinPointWeight="count"
                hexBinPointLng={useCallback(d => d.long,[])}
                hexBinPointLat={useCallback(d => d.lat,[])}
                hexAltitude={useCallback(d => arcThickScale(d.sumWeight),[])}
                hexBinResolution={4}
                hexTopColor={useCallback(d => colorsCategory(d.points[0][colorKey]),[])}
                hexSideColor={useCallback(d => colorsCategory(d.points[0][colorKey]),[])}

                hexBinMerge={true}
                hexLabel={useCallback(d => {return `
            <b>${d.points.length}</b> stations:<ul><li>
              ${d.points.slice().sort((a, b) => b.count - a.count).map(d => d.title).join('</li><li>')}
            </li></ul>
          `},[])}

                onGlobeClick={stopPlay}
            />
        </div>
    </div>;
}

export default Earth3D;
