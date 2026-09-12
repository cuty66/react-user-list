import { createContext, useEffect, useState } from "react";
export const ThemeContext = createContext();

export function ThemeProvider({children}) {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}