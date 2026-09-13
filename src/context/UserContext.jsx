import { createContext, useEffect, useReducer, useContext, useCallback, useMemo } from "react";

export const UserContext = createContext();

export function useUser(){
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
}

const storedUser = localStorage.getItem('user');
const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
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
        case "LOGIN_SUCCESS": 
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
            };
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
            localStorage.setItem('user', JSON.stringify(state.user))
        } else {
            localStorage.removeItem('user')
        }
    }, [state.user])

    const login = useCallback(async () => {
        dispatch({
            type: "LOGIN_START",
        });
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
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
        }
    }, []);

    const logout = useCallback(()=>{
        dispatch({
            type: "LOGOUT",
        });
    },[]);

    const value = useMemo(() => {
        return {state, login, logout, isAuthenticated}
    }, [state, login, logout]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}