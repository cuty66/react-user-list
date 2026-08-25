import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    function handleBack() {
        navigate("/");
    }
    return (
        <section className="text-center"> 
            <h1>404</h1> <p>Page not found</p> 
            <button onClick={handleBack}>Back to Users</button>
        </section> 
    );
}