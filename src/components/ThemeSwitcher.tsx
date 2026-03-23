import { IconMoon, IconSun } from "./Icons";
import { useTheme } from "../contexts/theme";

import "./ThemeSwitcher.css";

interface ThemeSwitcherProps {
	className?: string;
	compact?: boolean;
}

export function ThemeSwitcher({
	className = "",
	compact = false,
}: ThemeSwitcherProps) {
	const { theme, isDark, toggleTheme } = useTheme();

	const nextThemeLabel = isDark ? "светла" : "тъмна";
	const currentThemeLabel = isDark ? "Тъмна" : "Светла";

	return (
		<button
			type="button"
			className={`theme-switcher ${compact ? "theme-switcher--compact" : ""} ${className}`.trim()}
			onClick={toggleTheme}
			aria-label={`Превключи към ${nextThemeLabel} тема`}
			aria-pressed={isDark}
			title={`Текуща тема: ${theme}`}>
			<span
				className="theme-switcher__icon"
				aria-hidden="true">
				{isDark ? <IconMoon /> : <IconSun />}
			</span>

			<span className="theme-switcher__text">{currentThemeLabel}</span>
		</button>
	);
}
