import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const {login, state} = useUser();
    const {loading, error } = state;
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        const success = await login(form);

        if(success) {
            navigate("/");
        }
    }

    return(
        <div className="container">
            <h3>Login</h3>
            <form onSubmit={handleLogin}>
                <div className="login-form">
                    <input 
                        type="text" 
                        name="name" 
                        value={form.username} 
                        onChange={
                            (e) => setForm(prev => ({
                                ...prev, 
                                username: e.target.value
                            }))
                        } 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        value={form.password} 
                        onChange={(e) => setForm(
                            prev => ({
                                ...prev, 
                                password: e.target.value
                            }))
                        } 
                    />
                </div>
                <button type="submit" disabled={loading}>Login</button>
            </form>
            {loading && (<span>Loading...</span>)}
            {error && (<span>{error}</span>)}
        </div>
    )
}