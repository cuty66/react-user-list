import { createContext, useEffect, useReducer, useContext, useCallback, useMemo } from "react";
import { apiFetch } from "../api/apiFetch";

export const UserContext = createContext();

export function useUser(){
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
}

const storedUser = localStorage.getItem('auth');
const parsedAuth = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
    user: parsedAuth?.user || null,
    accessToken: parsedAuth?.accessToken || null,
    refreshToken: parsedAuth?.refreshToken || null,
    loading: false,
    error: null,
}
function reducer(state, action) {
    
    switch(action.type) {
        
        case "LOGIN_START": 
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "LOGIN_SUCCESS": {
            const {accessToken, refreshToken, ...user } = action.payload;
            return {
                ...state,
                user,
                accessToken,
                refreshToken,
                loading: false,
                error: null,
            };
        } 
            
        case "REFRESH_SUCCESS": {
            const {accessToken, refreshToken } = action.payload;
            return {
                ...state,
                accessToken,
                refreshToken,
                loading: false,
                error: null,
            }
        }

        case "LOGIN_ERROR": 
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                accessToken: null,
                refreshToken: null,
                loading: false,
                error: null,
        };
        default:
            return state;
    }
}
export function UserProvider({children}) {

    const [state, dispatch] = useReducer(reducer, initialState);
    const isAuthenticated = Boolean(state.user);
    useEffect(()=>{
        if(state.user) {
            localStorage.setItem('auth', JSON.stringify({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken
            }));
        } else {
            localStorage.removeItem('auth')
        }
    }, [state.user, state.refreshToken, state.accessToken])

    const login = useCallback(async (form) => {
        dispatch({
            type: "LOGIN_START",
        });
        try {
            const response = await fetch('https://dummyjson.com/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })
            if(!response.ok) {
                throw new Error("Request failed");
            }
            const data = await response.json();
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: data,
            });

            return true;
        } catch(error) {
            dispatch({
                type: "LOGIN_ERROR",
                payload: error.message,
            });
            return false;
        }
    }, []);

    const logout = useCallback(()=>{
        dispatch({
            type: "LOGOUT",
        });
    },[]);

    const { refreshToken } = state;

    const refresh = useCallback(async () => {
        try {
            // console.log("refreshToken from state:", refreshToken);
            // console.log(
            // "refreshToken from localStorage:",
            // JSON.parse(localStorage.getItem("auth"))?.refreshToken
            // );
            const response = await fetch('https://dummyjson.com/auth/refresh', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({refreshToken})
            })
            if(!response.ok) {
                throw new Error("Request failed");
            }
            const data = await response.json();
            // console.log(data);
            dispatch({
                type: "REFRESH_SUCCESS",
                payload: data,
            });

            return data.accessToken;
        } catch(error) {
            dispatch({
                type: "LOGIN_ERROR",
                payload: error.message,
            });
            return false;
        }
    }, [refreshToken]);

    const getMe = useCallback(async(token) => {
        dispatch({
            type: "LOGIN_START",
        });
        try {
            const response = await apiFetch('https://dummyjson.com/auth/me', {}, token, refresh);
            if (!response) {
                logout();
                throw new Error("Request failed");
            }
            const data = await response.json();
            return true;
        } catch(error) {
            dispatch({
                type: "LOGIN_ERROR",
                payload: error.message,
            });
            return false;
        }
    }, [refresh, logout]);

    const testConcurrentRequests = useCallback(async () => {
        console.log("START 3 REQUESTS");

        const results = await Promise.all([
            getMe(state.accessToken),
            getMe(state.accessToken),
            getMe(state.accessToken),
        ]);

        console.log("RESULTS:", results);
    }, [getMe, state.accessToken]);

    const value = useMemo(() => {
        return {state, login, logout, getMe,refresh, isAuthenticated, testConcurrentRequests}
    }, [state, login, logout, getMe, refresh]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}