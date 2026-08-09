import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

// چون این تابع ممکن است هم در مرورگر هم در سرور (Node، حین SSR) اجرا شود،
// دسترسی به localStorage باید محافظت‌شده باشد — در Node این API اصلاً وجود ندارد.
function getInitialTheme() {
    if (typeof window === 'undefined') {
        return 'system';
    }
    return localStorage.getItem('theme') || 'system';
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);
        root.classList.toggle('dark', isDark);
    }, [theme]);

    const updateTheme = (newTheme) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newTheme);
        }
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}