import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { ThemeContext } from "../context/ThemeContext";

export function Header() {
    const {user, setUser} = useContext(UserContext);
    const {theme, setTheme} = useContext(ThemeContext);
    return(
        <header>
            <div className="container">
                <div className="flex header-wrapper">
                    <h1>Users Dashboard</h1>
                    <div className="flex gap-3">
                        { user ? (
                        <p className="flex">
                            {user.name}
                            <button onClick={() => setUser(null)}>Logout</button>
                        </p>
                        ) : (
                            <button>Login</button>
                        )}
                        {theme} : <button onClick={() => setTheme(theme==='light' ? 'dark' : 'light')}>Change Theme</button>
                    </div>
                </div>
            </div>
        </header>
    )
}