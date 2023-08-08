import {useLocation} from "react-router-dom";
import {useDatabase} from "../Database";
import {useMemo} from "react";

export default function useQuery() {
    const { search } = useLocation();
    console.log(search);
    const {requestDetail} = useDatabase();
    return useMemo(() => {
        const queryObject = new URLSearchParams(search);
        debugger
        requestDetail({_id:queryObject.get("id")});
        return queryObject;
    }, [search]);
}