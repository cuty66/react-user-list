import { useState, useEffect } from "react";

export default function useFetch(url) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);

    useEffect(()=>{
        setError("");
        setData(null);
        setIsLoading(true);
        fetch(url)
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
            setError(error.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
            
    }, [url]);


    return {
        data,
        isLoading,
        error
    }
}