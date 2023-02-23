import undoable from 'redux-undo';
import { configureStore } from '@reduxjs/toolkit'
import streamFilters from './streamfilters'
import customizationReducer from "./customizationReducer";

const mcApp = configureStore({
    reducer: {
        streamFilters:undoable(streamFilters),
        customization: customizationReducer
    }
});

export default mcApp