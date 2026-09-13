import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
    const {login} = useUser();
    const navigate = useNavigate();
    async function handleLogin() {
        const success = await login();

        if(success) {
            navigate("/");
        }
    }
    return(
        <div className="container">
            <h1>Login</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}