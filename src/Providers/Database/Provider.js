import React, {useCallback, useEffect, useReducer} from 'react'
import Context from './Context'
import {groups as d3groups, group as d3group, mean as d3mean, csv as d3csv} from "d3"
import {isArray, uniq} from 'lodash';
import axios from 'axios';

const APIKey = process.env.REACT_APP_DATA_API;
const APIUrl = ((process.env.NODE_ENV === 'production') ? process.env.REACT_APP_DATA_URL : process.env.REACT_APP_DATA_URL_LOCAL);

axios.defaults.headers.common = {
    "api-key": APIKey,
};

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


const init = {fields: {value:{stationData:[],
            locationData:[]}},
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
        const controllerS = new AbortController();
        const controllerL = new AbortController();

        try {
            console.time('Load and process data');
            console.time('-Load data-');
            // dispatch({type: 'LOADING_CHANGED', path: 'rawData', isLoading: true});
            dispatch({type: 'LOADING_CHANGED', path: 'locs', isLoading: true});
            dispatch({type: 'LOADING_CHANGED', path: 'countries', isLoading: true});
            dispatch({type: 'LOADING_CHANGED', path: 'fields', isLoading: true});
            // load data
            Promise.all([
                axios.get(`${APIUrl}/station/city`,{
                    signal: controllerS.signal
                }).then(({data})=> {
                    return data
                }),
                axios.get(`${APIUrl}/station/country/`,{
                    signal: controllerL.signal
                }).then(({data})=>data),
                axios.get(`${APIUrl}/station/fields/`,{
                    signal: controllerL.signal
                }).then(({data})=>data),
                axios.get(`${APIUrl}/location/fields/`,{
                    signal: controllerL.signal
                }).then(({data})=>data),
                // axios.get(`${APIUrl}/location/`,{
                //     signal: controllerL.signal
                // }).then(({data})=>data),
            ]).then(([locs, countries,stationFields,locationFields]) => {
                console.timeEnd('-Load data-');
                // console.time('-Correct data-');
                // const locationDataMap = {};
                // locationData.forEach(d => {
                //     d.lat = (+d.longitude);
                //     d.long = (+d.latitude);
                //     delete d.longitude;
                //     delete d.latitude;
                //     locationDataMap[d['city_id']] = d;
                // });
                // let stationDataMap = {};
                // stationData.forEach(d => {
                //     d.lat = locationDataMap[d['city_id']].lat;
                //     d.long = locationDataMap[d['city_id']].long;
                //     d.country = locationDataMap[d['city_id']].country;
                //     d.city = locationDataMap[d['city_id']].city;
                //     stationDataMap[d['station_id']] = d;
                // });
                // const rawData = {stationData, locationData,stationDataMap,locationDataMap};
                // dispatch({type: 'VALUE_CHANGE', path: 'rawData', value: rawData, isLoading: false,});
                // console.timeEnd('-Correct data-');
                // console.time('-filterdata-');
                // const {locs, countries} = handleData(rawData);
                const fields = {...stationFields,...locationFields}
                // console.log(fields.city)
                // Object.keys(fields).forEach(k=>fields[k].sort())
                countries.sort((a, b) => b.count - a.count)
                locs.sort((a, b) => b.count - a.count)
                dispatch({type: 'VALUE_CHANGE', path: 'locs', value: locs, isLoading: false});
                dispatch({type: 'VALUE_CHANGE', path: 'countries', value: countries, isLoading: false});
                dispatch({type: 'VALUE_CHANGE', path: 'fields', value: fields, isLoading: false});
                // console.timeEnd('-filterdata-');
                console.timeEnd('Load and process data');
            });
        } catch (error) {
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
            dispatch({
                type: "ERROR",
                path: 'fields',
                isLoading: false,
                error,
                hasError: true,
            });
        }
        return ()=>{
            console.log('destroy!!!')
            controllerS.abort();
            controllerL.abort();
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
            return (state[path] && state[path].value) ? state[path].value : [];
        },
        [state]
    );

    // get list of field
    const getDistinctField = useCallback(
        (field) => {
            return state.fields && state.fields.value[field] ? state.fields.value[field] : [];
            // switch (field) {
            //     case 'city':
            //         return state.fields && state.fields.value[field] ? state.fields.value[field] : [];
            //     case 'country':
            //         return state.countries && state.countries.value ? state.countries.value.map(d=>d.title) : [];
            //     case 'station':
            //         return state.rawData && state.rawData.value.stationData ? uniq(state.rawData.value.stationData.map(d=>d.station)) : [];
            //     case 'station_genre':
            //         return state.rawData && state.rawData.value.metaData ? uniq(state.rawData.value.metaData.map(d=>d.station_genre)) : [];
            //     case 'stream_artist':
            //         return state.rawData && state.rawData.value.streamDetail ? uniq(state.rawData.value.streamDetail.map(d=>d.stream_artist)) : [];
            //     case 'stream_song':
            //         return state.rawData && state.rawData.value.streamDetail ? uniq(state.rawData.value.streamDetail.map(d=>d.stream_song)) : [];
            //     default:
            //         return [];
            // }
        },
        [state]
    );
    const searchByStream = (path,query)=>{
        dispatch({type: 'LOADING_CHANGED', path: `search-${path}`, isLoading: true});
        return axios.get(`${APIUrl}/stream/search?${path}=${query}`).then(({data})=> {
            dispatch({type: 'VALUE_CHANGE', path: `search-${path}`, value: data.map(d=>d._id), isLoading: false});
        }).catch ((error)=> {
            dispatch({
                type: "ERROR",
                path: `search-${path}`,
                isLoading: false,
                error,
                hasError: true,
            });
        })
    }
    const getEvents = useCallback(
        () => {
            return (state.events && state.events.value ? state.events.value : []);
        },
        [state]
    );
    const requestEvents = useCallback(
        (filter,limit) => {
            dispatch({type: 'LOADING_CHANGED', path: 'events', isLoading: true});
            axios.post(`${APIUrl}/meta/`, {filter}).then(({data})=> {
                dispatch({type: 'VALUE_CHANGE', path: 'events', value:data??[], isLoading: false});
            }).catch(error=>{
                dispatch({
                    type: "ERROR",
                    path: `events`,
                    isLoading: false,
                    error,
                    hasError: true,
                });
            })
            // new Promise((resolve,reject)=>{
            //     let data = (state.rawData.value??{metaData:[]}).metaData.slice();
            //     Object.keys(filter).forEach(filterKey=>{
            //         if (filter[filterKey] && data.length) {
            //             if (isArray(filter[filterKey])){
            //                 if (filter[filterKey].length) {
            //                     data = data.filter(d => filter[filterKey].find(e=>e===d[filterKey]));
            //                 }
            //             }else if (filter[filterKey])
            //             {
            //                 data = data.filter(d => d[filterKey] === filter[filterKey]);
            //             }
            //         }
            //     })
            //     // data.sort((a,b)=>(+new Date(b.time_station))- (+new Date(a.time_station)));
            //     const value = data.slice(0,limit);
            //     dispatch({type: 'VALUE_CHANGE', path: 'events', value, isLoading: false});
            //     resolve(value);
            // })
        },
        [state]
    );
    const getDetail = useCallback(
        (stream_detail_id) => {
            const r = (state.events && state.events.value ? state.events.value : []).find(d=>d.stream_detail_id===stream_detail_id);
            if (r) {
                return getExtra (r,state.rawData.value.stationDataMap,state.rawData.value.locationDataMap,state.rawData.value.streamDetail);
            }else
                return null
        },
        [state]
    );
    function getExtra (r,stationDataMap,locationDataMap,streamDetail){
        return {
            ...r,
            station_description:stationDataMap[r['station_id']].station_description,
            station_url:stationDataMap[r['station_id']].station_url,
            lat:locationDataMap[r['city_id']].lat,
            long:locationDataMap[r['city_id']].long,
            url:stationDataMap[r['station_id']].url,
            // stream_song:streamDetail[r['stream_detail_id']].stream_song,
            ...streamDetail[r['stream_detail_id']]
        }
    }
    const getDownloadData = useCallback((listids)=>{
        if (listids) {
            let data = (state.rawData.value ?? {metaData: []}).metaData;
            return listids.sort((a, b) => a - b).map(i => getExtra(data[i], state.rawData.value.stationDataMap, state.rawData.value.locationDataMap, state.rawData.value.streamDetail))
        }else
            return (state.rawData.value ?? {metaData: []}).metaData
                .map(d => getExtra(d, state.rawData.value.stationDataMap, state.rawData.value.locationDataMap, state.rawData.value.streamDetail));
    },[state]);

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
            requestEvents,
            getDistinctField,
            searchByStream,
            getDetail,
            getListError,
            getDownloadData,
            isLoading
        }}>
            {children}
        </Context.Provider>
    )
}

export default Provider;