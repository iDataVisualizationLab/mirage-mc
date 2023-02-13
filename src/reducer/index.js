import undoable from 'redux-undo';
import { configureStore } from '@reduxjs/toolkit'
import streamFilters from './streamfilters'

const mcApp = configureStore({
    reducer: {streamFilters:undoable(streamFilters)}
});

export default mcApp