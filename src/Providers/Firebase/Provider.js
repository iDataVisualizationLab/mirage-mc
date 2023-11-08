// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import React, {useCallback, useReducer, useEffect} from "react";
import Context from "./Context";
import axios from "axios";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCFK3B65zD95QoLbkPwdxuYfpLsE7VlT7c",
    authDomain: "mirage-mc-a4126.firebaseapp.com",
    projectId: "mirage-mc-a4126",
    storageBucket: "mirage-mc-a4126.appspot.com",
    messagingSenderId: "534512658347",
    appId: "1:534512658347:web:ed50ed852f35a3050554ee",
    measurementId: "G-Q0T1WZE312"
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
            console.log(type)
            return state
        // throw new Error()
    }
}

const init = {
    app: {},
    analytics: {},
    ip: {},
    location: {},
    loading:false,
    error:false,
}
const Provider = ({  children }) => {
    const [state, dispatch] = useReducer(reducer, init);

    useEffect(()=>{
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        dispatch({type: 'VALUE_CHANGE', path: `app`, value: app, isLoading: false});
        dispatch({type: 'VALUE_CHANGE', path: `analytics`, value: analytics, isLoading: false});
        fetch('http://api.ipify.org/?format=json')
            .then(response => response.json())
            .then(data => {
                dispatch({type: 'VALUE_CHANGE', path: `ip`, value: data.ip, isLoading: false});
            }).catch((e)=>{
            // console.log(e)
            dispatch({type: 'VALUE_CHANGE', path: `ip`, value: undefined, isLoading: false});
        });
    },[])

    const logEvents = useCallback(async(eventName,eventValue)=>{
        // console.log({...eventValue,ip:state.ip.value,location:state.location.value})
        if (!eventValue)
            logEvent(state.analytics.value, eventName,{ip:state.ip.value,location:state.location.value});
        else
            logEvent(state.analytics.value, eventName, {...eventValue,ip:state.ip.value,location:state.location.value});
    },[state]);
    const setlocation = useCallback((location)=>{
        dispatch({type: 'VALUE_CHANGE', path: `location`, value: location, isLoading: false});
    },[state])
    return <Context.Provider value={{
        logEvents,
        setlocation
    }}>
        {children}
    </Context.Provider>
};
export default Provider;