import React, { createContext, useState, useEffect, ReactNode} from "react"

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {},
});

interface Props {
    children: ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({children}) => {
    const [theme, setTheme] = useState<Theme>(
        (localStorage.getItem("theme") as Theme) || "light"
    );

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    },[theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider