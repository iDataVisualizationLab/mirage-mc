import React, {useCallback, useEffect, useReducer} from 'react'
import Context from './Context'
import {groups as d3groups, group as d3group, mean as d3mean, csv as d3csv} from "d3"
import {uniq} from 'lodash';
import axios from 'axios';
import RG_stations_listed from "./data/Jan_24_2023/stations_listed.csv"
import RG_locations_listed from "./data/Jan_24_2023/locations_listed.csv"
import RG_metadata from "./data/Jan_24_2023/metadata.csv"
import RG_streamDetail from "./data/Jan_24_2023/streamDetail.csv"

function reducer(state, action) {
    const { type, path, isLoading=false,error = false,
        hasError = false, value } = action;
    switch (type) {
        case "LOADING_CHANGED":
            return { ...state, [path]: { ...state[path], isLoading } };
        case "VALUE_CHANGE":
            return {
                ...state,
                [path]: { ...state[path], value, isLoading, error, hasError },
            };
        case "INIT":
            return {...state,isInit:value}
        default:
            throw new Error()
    }
}

function handleData({stationData, locationData, metaData}) {
    const groupByLocation = d3groups(stationData, d => d["city_id"]);
    // route
    console.time('---group meta---')
    const byLocName = d3group(locationData, d=>d['city_id']);
    const metabyLocName = d3group(metaData,d=>d['city_id']);
    console.timeEnd('---group meta---')

    const locs = groupByLocation.map(d => {
        const meta = metabyLocName.get(d[0])??[];
        const locinfo = (byLocName.get(d[0])??[])[0]??{};
        return {
            ...locinfo,
            "title": `${locinfo.city} - ${locinfo.country}`,
            count: d[1].length,
            values: d[1],
            // genre: d3groups(meta,d=>d.station_genre).map(d=>{d.title=d[0];d.count=d[1].length;return d}),
            city: [[locinfo.city,meta]].map(d=>{d.title=d[0];d.count=d[1].length;return d}),
        }
    });
    locs.sort((a, b) => b.count - a.count);


    const countries = d3groups(stationData, d => d["country"]).map(d => {
        return {
            "title": d[0],
            long: d3mean(d[1], e => e.long),
            lat: d3mean(d[1], e => e.lat),
            count: d[1].length,
            values: d[1]
        }
    }).sort((a, b) => b.count - a.count);

    return {locs, countries};
}
const init = {rawData: {value:{stationData:[],
            locationData:[],
            metaData:[], streamDetail:[]}},
    locs:{},
    countries:{},
    events: {},
    loading:false,
    error:false,
    isInit:false
}
let isfirst = 0;
const Provider = ({  children }) => {
    const [state, dispatch] = useReducer(reducer, init);
    useEffect(() => {
        if ((!state.rawData.isLoading)&&(!state.rawData.value.metaData.length)) {
            isfirst = 1;
            try {
                console.time('Load and process data');
                console.time('-Load data-');
                dispatch({type: 'LOADING_CHANGED', path: 'rawData', isLoading: true});
                dispatch({type: 'LOADING_CHANGED', path: 'locs', isLoading: true});
                dispatch({type: 'LOADING_CHANGED', path: 'countries', isLoading: true});
                // load data
                Promise.all([
                    d3csv(RG_stations_listed),
                    d3csv(RG_locations_listed),
                    d3csv(RG_metadata),
                    d3csv(RG_streamDetail),
                ]).then(([stationData, locationData, metaData, streamDetail]) => {
                    console.timeEnd('-Load data-');
                    console.time('-Correct data-');
                    const locationDataMap = {};
                    locationData.forEach(d => {
                        d.lat = (+d.longitude);
                        d.long = (+d.latitude);
                        delete d.longitude;
                        delete d.latitude;
                        locationDataMap[d['city_id']] = d;
                    });
                    let stationDataMap = {};
                    stationData.forEach(d => {
                        d.lat = locationDataMap[d['city_id']].lat;
                        d.long = locationDataMap[d['city_id']].long;
                        d.country = locationDataMap[d['city_id']].country;
                        d.city = locationDataMap[d['city_id']].city;
                        stationDataMap[d['station_id']] = d;
                    });

                    metaData.forEach((d) => {
                        d.station_genre = stationDataMap[d['station_id']].station_genre;
                        d.city = locationDataMap[d['city_id']].city;
                        d.country = locationDataMap[d['city_id']].country;
                        d.station = stationDataMap[d['station_id']].station;
                        d.stream_artist = streamDetail[d['stream_detail_id']].stream_artist;
                        // d.stream_title = streamDetail[d['stream_detail_id']].stream_title;
                        d.stream_song = streamDetail[d['stream_detail_id']].stream_song;
                        // d.time_station = streamDetail[d['stream_detail_id']].time_station;
                    })

                    const rawData = {stationData, locationData, metaData, streamDetail,stationDataMap,locationDataMap};
                    dispatch({type: 'VALUE_CHANGE', path: 'rawData', value: rawData, isLoading: false,});
                    console.timeEnd('-Correct data-');
                    console.time('-filterdata-');
                    const {locs, countries} = handleData(rawData);
                    dispatch({type: 'VALUE_CHANGE', path: 'locs', value: locs, isLoading: false});
                    dispatch({type: 'VALUE_CHANGE', path: 'countries', value: countries, isLoading: false});
                    dispatch({type: 'VALUE_CHANGE', path: 'events', value: metaData, isLoading: false});
                    console.timeEnd('-filterdata-');
                    console.timeEnd('Load and process data');
                });
            } catch (error) {
                dispatch({
                    type: "ERROR",
                    path: 'rawData',
                    isLoading: false,
                    error,
                    hasError: true,
                });
                dispatch({
                    type: "ERROR",
                    path: 'locs',
                    isLoading: false,
                    error,
                    hasError: true,
                });
                dispatch({
                    type: "ERROR",
                    path: 'countries',
                    isLoading: false,
                    error,
                    hasError: true,
                });
            }
        }
    }, []);

    const getListError = useCallback(
        (path) => {
            return state[path] ? state[path].error : false;
        },
        [state]
    );
    const getList = useCallback(
        (path) => {
            return state[path] && state[path].value ? state[path].value : [];
        },
        [state]
    );

    // get list of field
    const getDistinctField = useCallback(
        (field) => {
            switch (field) {
                case 'City':
                    return state.rawData && state.rawData.value.locationData ? state.rawData.value.locationData.map(d=>d.city) : [];
                case 'Country':
                    return state.countries && state.countries.value ? state.countries.value.map(d=>d.title) : [];
                case 'Genre':
                    return state.rawData && state.rawData.value.metaData ? uniq(state.rawData.value.metaData.map(d=>d.station_genre)) : [];
                case 'Artist':
                    return state.rawData && state.rawData.value.streamDetail ? uniq(state.rawData.value.streamDetail.map(d=>d.stream_artist)) : [];
                case 'Song':
                    return state.rawData && state.rawData.value.streamDetail ? uniq(state.rawData.value.streamDetail.map(d=>d.stream_song)) : [];
                default:
                    return [];
            }
        },
        [state]
    );

    const getEvents = useCallback(
        (limit) => {
            return (state.events && state.events.value ? state.events.value : []).slice(0,limit);
        },
        [state]
    );
    const getDetail = useCallback(
        (stream_detail_id) => {
            const r = (state.events && state.events.value ? state.events.value : []).find(d=>d.stream_detail_id===stream_detail_id);
            if (r) {
                return {
                    ...r,
                    station_description:state.rawData.value.stationDataMap[r['station_id']].station_description,
                    station_url:state.rawData.value.stationDataMap[r['station_id']].station_url,
                    lat:state.rawData.value.locationDataMap[r['city_id']].lat,
                    long:state.rawData.value.locationDataMap[r['city_id']].long,
                    url:state.rawData.value.stationDataMap[r['station_id']].url,
                    stream_song:state.rawData.value.streamDetail[r['stream_detail_id']].stream_song,
                }
            }else
                return null
        },
        [state]
    );

    const isLoading = useCallback(
        (path) => {
            return state[path] ? state[path].isLoading : false;
        },
        [state]
    );
    return (
        <Context.Provider value={{
            getList,
            getEvents,
            getDistinctField,
            getDetail,
            getListError,
            isLoading
        }}>
            {children}
        </Context.Provider>
    )
}

export default Provider;