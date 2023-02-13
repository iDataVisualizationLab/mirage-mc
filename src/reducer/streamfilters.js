import { createSlice } from "@reduxjs/toolkit";

const initialState= {};
const streamFilters = createSlice({
    name: "streamFilters",
    initialState,
    reducers: {
        setFilter: (state,action) => {
            state[action.key] = action.value;
        },
        setFilters: (state,action) => ({
            ...action.value
        })
    }
});
export const { setFilter, setFilters } = streamFilters.actions;
export const selectFilters = (state) => state.streamFilters.present;
export default streamFilters.reducer