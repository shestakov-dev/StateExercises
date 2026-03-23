import { useTheme } from "../../contexts/theme";
import { ThemeSwitcher } from "../ThemeSwitcher";

import "./Theme.css";

export function DemoHeader() {
	const { theme } = useTheme();

	const isDark = theme === "dark";

	return (
		<header
			className="theme-demo-header"
			style={{ background: isDark ? "#1e293b" : "#0284c7" }}>
			<span className="theme-demo-brand">QuizApp</span>

			<ThemeSwitcher compact />
		</header>
	);
}

interface QuizCardProps {
	title: string;
	questions: number;
}

export function QuizCard({ title, questions }: QuizCardProps) {
	return (
		<article
			className="theme-quiz-card"
			style={{
				border: "1px solid var(--border)",
				background: "var(--bg-raised)",
				color: "var(--text-primary)",
			}}>
			<div style={{ minWidth: 0, flex: 1 }}>
				<p className="theme-quiz-card__title">{title}</p>

				<p className="theme-quiz-card__sub">{questions} въпроса</p>
			</div>

			<button
				type="button"
				className="theme-start-btn"
				aria-label={`Започни теста: ${title}`}>
				Започни
			</button>
		</article>
	);
}

export function DemoFooter() {
	const { theme } = useTheme();

	return (
		<footer
			className="theme-demo-footer"
			style={{
				borderTop: "1px solid var(--border)",
				background: "var(--bg-overlay)",
				color: "var(--text-secondary)",
			}}>
			<p>
				React Context API · Тема:{" "}
				<strong style={{ color: "var(--text-primary)" }}>{theme}</strong>
			</p>
		</footer>
	);
}
