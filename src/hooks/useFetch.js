import { useEffect, useRef, useCallback, useReducer } from "react";

export default function useFetch(url) {
    const initialState = {
        data: null,
        isLoading: false,
        error: null,
    }
    function reducer(state, action) {
        switch(action.type) {
            case "FETCH_START":
                return {
                    ...state,
                    data: null,
                    isLoading: true,
                    error: null,
                };
            case "FETCH_SUCCESS": 
                return {
                    data: action.payload,
                    isLoading: false,
                    error: null,
                };
            case "FETCH_ERROR":
                return {
                    ...state,
                    error: action.payload,
                    isLoading: false,
                };
            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    const requestRef = useRef(0);
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
        dispatch({type: "FETCH_START"})
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
                dispatch({
                    type: "FETCH_SUCCESS",
                    payload: json,
                })
            })
            .catch(error => {
                if (requestId !== requestRef.current) return;
                if(error.name==='AbortError') {
                    console.log('Fetch aborted');
                } else {
                    dispatch({
                        type: "FETCH_ERROR",
                        payload: error.message,
                    })
                }
            })
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
        ...state,
        refetch: fetchData,
    }
}