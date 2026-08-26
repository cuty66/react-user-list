import { useState, useEffect } from "react";

export default function useFetch(url) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    // function delay(ms, signal) {
    //     return new Promise((resolve, reject) => {
    //         const timer = setTimeout(resolve, ms);

    //         signal.addEventListener("abort", () => {
    //             clearTimeout(timer);
    //             reject(new DOMException("Aborted", "AbortError"));
    //         });
    //     });
    // }
    useEffect(()=>{
        const abortController = new AbortController();
        setError("");
        setData(null);
        setIsLoading(true);
        fetch(url, {signal: abortController.signal})
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


        return() => {
            abortController.abort();
        };
            
    }, [url]);


    return {
        data,
        isLoading,
        error
    }
}