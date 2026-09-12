import { createContext, useEffect, useState, useContext } from "react";
export const ThemeContext = createContext();
export function useTheme() {
    return useContext(ThemeContext);
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