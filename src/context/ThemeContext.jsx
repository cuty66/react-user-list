import { createContext, useEffect, useState, useContext } from "react";
export const ThemeContext = createContext();
export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return context;
}

const storedTheme = localStorage.getItem('themeMode')
export function ThemeProvider({children}) {
    const [theme, setTheme] = useState(storedTheme || 'light');

    useEffect(() => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
        localStorage.setItem('themeMode', theme);
    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}