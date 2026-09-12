import { createContext, useEffect, useReducer, useContext } from "react";

export const UserContext = createContext();

export function useUser(){
    return useContext(UserContext);
}

const storedUser = localStorage.getItem('user');
const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null
}
function reducer(state, action) {
    switch(action.type) {
        case "LOGOUT":
            return {
                ...state,
                user: null
            };
        case "LOGIN": 
            return {
                ...state,
                user: action.payload,
            }
        default:
            return state;
    }
}
export function UserProvider({children}) {

    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(()=>{

        if(state.user) {
            localStorage.setItem('user', JSON.stringify(state.user))
        } else {
            localStorage.removeItem('user')
        }


    }, [state.user])

    function login(user) {
        dispatch({
            type: "LOGIN",
            payload: user,
        });
    }

     function logout() {
        dispatch({
            type: "LOGOUT",
        });
    }
    return (
        <UserContext.Provider value={{state, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}