import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext"

export default function GuestRoute({children}){
    const {isAuthenticated} = useUser();
    if(isAuthenticated) {
        return <Navigate to="/" replace />
    }
    return children;
}