import { useState, useEffect, useRef } from "react";

export default function useFetch(url) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const controllerRef = useRef(new AbortController());
    
    function refetch(){
        controllerRef.current.abort();
        controllerRef.current = new AbortController();
        fetchData(url);
    }

    function fetchData(inp) {
        setError("");
        setData(null);
        setIsLoading(true);
        fetch(inp, {signal: controllerRef.current.signal})
        .then(response => {
            if( response.status === 404) {
                throw new Error(`${response.status} : Resource NOt Found`)
            }
            if(!response.ok) {
                throw new Error("Something went wrong !!!");
            }
            return response.json();
        })
        .then(json  => {
            setData(json);
        })
        .catch(error => {
            if(error.name==='AbortError') {
                console.log('Fetch aborted');
            } else {
                setError(error.message);
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    }
    useEffect(()=>{
        controllerRef.current = new AbortController();
        fetchData(url);

        return() => {
            controllerRef.current.abort();
        };
            
    }, [url]);


    return {
        data,
        isLoading,
        error,
        refetch,
    }
}