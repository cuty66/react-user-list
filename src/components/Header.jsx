import { useUser } from "../context/UserContext"
import { useTheme } from "../context/ThemeContext";

export function Header() {
    const {state, login, logout} = useUser();
    const { user, loading, error } = state;
    const {theme, setTheme} = useTheme();

    return(
        <header>
            <div className="container">
                <div className="flex header-wrapper">
                    <h1>Users Dashboard</h1>
                    <div className="flex gap-3">
                        {loading && (<span>Loading...</span>)}
                        {error && (<span>{error}</span>)}
                        { user ? (
                        <p className="flex">
                            {user.name}
                            <button onClick={logout}>Logout</button>
                        </p>
                        ) : (
                            <button onClick={login}>Login</button>
                        )}
                        {theme} : <button onClick={() => setTheme(theme==='light' ? 'dark' : 'light')}>Change Theme</button>
                    </div>
                </div>
            </div>
        </header>
    )
}