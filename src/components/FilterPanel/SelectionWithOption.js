import React from "react";
import {Stack, MenuItem, Select,FormControl, TextField} from "@mui/material";
import CusAutocomplete from "./CusAutocomplete";
import ListboxComponent from "../ListboxComponent";
import { useSelector, useDispatch } from "react-redux";
import {
    setFilter,
    setFilters,
    selectFilters
} from "../../reducer/streamfilters";

const emptyArray = [];
const emptyObj = {};
const emptyFunc = ()=>{};
export default function SelectionWithOption({options=emptyArray,
    enabled=emptyObj, onChangeCat=emptyFunc, filterOptionsFunc,
    order=0,
    filterOptions,searchByStream,
    getList, isLoading, logEvents}) {
    const [cat, setCat] = React.useState('');
    const [f, setF] = React.useState({});
    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);

    const handleChange = (event) => {
        onChangeCat(cat,event.target.value);
        setF(options.find(d=>d.accessorKey===event.target.value));
        setCat(event.target.value);
        // reset filter 
        dispatch(setFilter({key:cat,value:[]}));
    };
    return <React.Fragment>
    <Stack direction={"row"}>
    <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={cat}
          onChange={handleChange}
          size="small"
        >
            {options.map((d)=><MenuItem value={d.accessorKey} key={d.accessorKey} disabled={enabled[d.accessorKey]}>
                {d.header}
                </MenuItem>)
            }
        </Select>
      </FormControl>
      <CusAutocomplete
            key={f.accessorKey}
            multiple
            size="small"
            limitTags={2}
            filterOptions={filterOptionsFunc}
            ListboxComponent={ListboxComponent}
            freeSolo
            options={(f.dynamic?getList(`search-${f.accessorKey}`):filterOptions[f.accessorKey])??[]}
            loading={f.dynamic?isLoading(`search-${f.accessorKey}`):false}
            getOptionLabel={(d) => d}
            value={filters[f.accessorKey]??[]}
            onChange={(event, value) => {
                if (value!=='' && value && value.length)
                    logEvents('search',{'search_term':value,key:f.accessorKey,})
                dispatch(setFilter({key:f.accessorKey,value,order}));
            }}
            onInputChange={f.dynamic?((event, newInputValue) => {
                if (newInputValue&&newInputValue!=='')
                    searchByStream(f.accessorKey,newInputValue);
            }):undefined}
            renderInput={(params) => (
                <TextField
                    {...params}
                    // label={f.header}
                />
            )}
        />
    </Stack>
    </React.Fragment>
}