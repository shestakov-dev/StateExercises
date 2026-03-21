import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	isDark: boolean;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "state-exercises-theme";

function getInitialTheme(): Theme {
	if (typeof window === "undefined") {
		return "dark";
	}

	const saved = window.localStorage.getItem(STORAGE_KEY);

	if (saved === "light" || saved === "dark") {
		return saved;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		window.localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			isDark: theme === "dark",
			toggleTheme: () =>
				setTheme(previousValue => (previousValue === "dark" ? "light" : "dark")),
		}),
		[theme],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used inside ThemeProvider");
	}

	return context;
}
