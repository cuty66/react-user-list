import { useState, useEffect, useRef, useCallback } from "react";

export default function useFetch(url) {
    const requestRef = useRef(0);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const controllerRef = useRef();

    const timerRef = useRef();
    
    const fetchData = useCallback(() => {
        if(controllerRef.current) {
            controllerRef.current.abort();
        }
        if(timerRef.current) {
            clearTimeout(timerRef.current);
        }
        const controller = new AbortController();
        setError("");
        setData(null);
        setIsLoading(true);
        const requestId = ++requestRef.current;
        controllerRef.current = controller;
        timerRef.current = setTimeout(() => {
            fetch(url, {signal: controller.signal})
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
                if (requestId !== requestRef.current) return;
                setData(json);
            })
            .catch(error => {
                if (requestId !== requestRef.current) return;
                if(error.name==='AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setError(error.message);
                }
            })
            .finally(() => {
                if (requestId !== requestRef.current) return;
                setIsLoading(false);
            });
        }, 1000);
    },[url]);
        
    useEffect(()=>{
        fetchData();
        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
            
    },[fetchData]);


    return {
        data,
        isLoading,
        error,
        refetch: fetchData,
    }
}