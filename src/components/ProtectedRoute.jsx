import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export function ProtectedRoute({ children }) {
    const { isAuthenticated } = useUser();
    if(!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return children;
};