import { createContext, useEffect, useReducer, useContext, useCallback, useMemo } from "react";

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

console.log(storedUser)
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
        case "LOGIN_SUCCESS": 
            const {accessToken, refreshToken, ...user } = action.payload;
            return {
                ...state,
                user,
                accessToken,
                refreshToken,
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
            }))
        } else {
            localStorage.removeItem('auth')
        }
    }, [state.user])

    const login = useCallback(async (form) => {
        dispatch({
            type: "LOGIN_START",
        });
        try {
            // const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
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

    const value = useMemo(() => {
        return {state, login, logout, isAuthenticated}
    }, [state, login, logout]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}