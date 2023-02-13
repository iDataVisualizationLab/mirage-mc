import React, {useEffect, useMemo, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setFilter,
    setFilters,
    selectFilters
} from "../../reducer/streamfilters";
import { ActionCreators } from "redux-undo";
import {Autocomplete, Stack, TextField} from "@mui/material";
import {filterSearch} from "../EventTable/fields";

const defaultFilters = {Station:""}
export default function FilterPanel() {
    const filters = useSelector(selectFilters);
    const dispatch = useDispatch();
    useEffect(()=>{
        if (!Object.keys(filters).length) {
            const newfilters = {};
            filterSearch.forEach(f=>{
                newfilters[f.accessorKey] = null;
            })
            dispatch(setFilters({value: newfilters}))
        }
    },[])
    return <Stack>
        {filterSearch.map(f=><Autocomplete
            multiple
            options={[]}
            getOptionLabel={(option) => option.title}
            value={filters[f.accessorKey]??[]}
            defaultValue={null}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={f.header}
                />
            )}
        />)}
    </Stack>
}