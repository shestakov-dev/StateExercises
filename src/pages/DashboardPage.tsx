import { useState } from "react";
import {
	DashboardLayout,
	useDashboardAuth,
	useDashboardLanguage,
	type DashboardPageConfig,
} from "../components/exercises/Dashboard";
import { IconChevronDown, IconChevronUp } from "../components/Icons";
import { useTheme } from "../contexts/theme";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

const DASHBOARD_DEMO_PAGES: DashboardPageConfig[] = [
	{
		key: "dashboard",
		getLabel: translate => translate("dashboard"),
		Content: DashboardOverviewView,
		requiresAuth: true,
	},
	{
		key: "quizzes",
		getLabel: translate => translate("quizzes"),
		Content: DashboardQuizzesView,
		requiresAuth: true,
	},
	{
		key: "settings",
		getLabel: translate => translate("settings"),
		Content: DashboardSettingsView,
		requiresAuth: true,
	},
];

export function DashboardOverviewView() {
	const { user } = useDashboardAuth();
	const { translate } = useDashboardLanguage();

	const [showAllQuizzes, setShowAllQuizzes] = useState(false);

	if (!user) {
		return null;
	}

	const stats = [
		{ label: translate("completed"), value: "12", colorModifier: "green" },
		{ label: translate("points"), value: "840", colorModifier: "yellow" },
		{ label: translate("progress"), value: "68%", colorModifier: "accent" },
	] as const;

	const quizProgress = [
		{ name: "HTML & CSS", progress: 34 },
		{ name: "JavaScript ES6+", progress: 90 },
		{ name: "React Hooks", progress: 70 },
		{ name: "Node.js", progress: 61 },
		{ name: "TypeScript", progress: 72 },
		{ name: "React Router", progress: 48 },
		{ name: "State Management", progress: 55 },
	];

	const visibleQuizzes = showAllQuizzes
		? quizProgress
		: quizProgress.slice(0, 4);

	return (
		<main
			className="dashboard-main"
			id="dashboard-main-content"
			tabIndex={-1}>
			<h1 className="dashboard-page-title">
				{translate("welcome")}, {user.name}
			</h1>

			<p className="dashboard-page-subtitle">
				{translate("dashboard")} · {user.role}
			</p>

			<div
				className="dashboard-stats-grid"
				role="list"
				aria-label="Статистики">
				{stats.map(stat => (
					<div
						key={stat.label}
						className="dashboard-stat-card"
						role="listitem"
						aria-label={`${stat.label}: ${stat.value}`}>
						<p className="dashboard-stat-label">{stat.label}</p>

						<p
							className={`dashboard-stat-val dashboard-stat-val--${stat.colorModifier}`}>
							{stat.value}
						</p>
					</div>
				))}
			</div>

			<div
				className="dashboard-quiz-list"
				aria-label="Прогрес по тестове">
				<p className="dashboard-section-heading">{translate("quizzes")}</p>

				{visibleQuizzes.map((quiz, index) => (
					<div
						key={quiz.name}
						className={`dashboard-quiz-row${index === visibleQuizzes.length - 1 ? " dashboard-quiz-row--last" : ""}`}>
						<span className="dashboard-quiz-title">{quiz.name}</span>

						<div
							className="dashboard-progress-wrap"
							role="progressbar"
							aria-valuenow={quiz.progress}
							aria-valuemin={0}
							aria-valuemax={100}
							aria-label={`${quiz.name}: ${quiz.progress}%`}>
							<div className="dashboard-progress-bar">
								<div
									className="dashboard-progress-fill"
									style={{ width: `${quiz.progress}%` }}
								/>
							</div>

							<span className="dashboard-progress-pct">{quiz.progress}%</span>
						</div>
					</div>
				))}

				{quizProgress.length > 4 && (
					<button
						type="button"
						className="button button--ghost button--sm dashboard-show-more"
						onClick={() => setShowAllQuizzes(previous => !previous)}
						aria-expanded={showAllQuizzes}>
						{showAllQuizzes ? (
							<>
								<IconChevronUp size={14} />
								{translate("showLess")}
							</>
						) : (
							<>
								<IconChevronDown size={14} />
								{translate("showMore")} {quizProgress.length - 4}
							</>
						)}
					</button>
				)}
			</div>
		</main>
	);
}

export function DashboardQuizzesView() {
	const { translate } = useDashboardLanguage();

	const quizzes = [
		{ name: "HTML & CSS", questions: 32, done: true },
		{ name: "JavaScript ES6+", questions: 45, done: true },
		{ name: "React Hooks", questions: 28, done: false },
		{ name: "Node.js", questions: 20, done: false },
		{ name: "TypeScript", questions: 36, done: false },
	];

	return (
		<main
			className="dashboard-main"
			tabIndex={-1}>
			<h1 className="dashboard-page-title">{translate("quizzes")}</h1>

			<ul className="dashboard-quiz-item-list">
				{quizzes.map(quiz => (
					<li
						key={quiz.name}
						className="dashboard-quiz-item">
						<div className="dashboard-quiz-item__info">
							<p className="dashboard-quiz-item__name">{quiz.name}</p>
							<p className="dashboard-quiz-item__meta">{quiz.questions} {translate("questions")}</p>
						</div>

						<span
							className={`dashboard-quiz-badge${quiz.done ? " dashboard-quiz-badge--done" : ""}`}>
							{quiz.done ? translate("complete") : translate("incomplete")}
						</span>
					</li>
				))}
			</ul>
		</main>
	);
}

export function DashboardSettingsView() {
	const { user, logout } = useDashboardAuth();
	const { translate } = useDashboardLanguage();
	const { theme } = useTheme();

	if (!user) {
		return null;
	}

	return (
		<main
			className="dashboard-main"
			tabIndex={-1}>
			<h1 className="dashboard-page-title">{translate("settings")}</h1>

			<div className="dashboard-settings-card">
				<div className="dashboard-settings-row">
					<p className="dashboard-settings-label">{translate("user")}</p>

					<p className="dashboard-settings-value">{user.name}</p>

					<p className="dashboard-settings-meta">{user.role}</p>
				</div>

				<div className="dashboard-settings-row dashboard-settings-row--inline">
					<div>
						<p className="dashboard-settings-label">{translate("theme")}</p>

						<p className="dashboard-settings-value">
							{theme === "dark" ? translate("dark") : translate("light")}
						</p>
					</div>

					<ThemeSwitcher />
				</div>

				<div className="dashboard-settings-footer">
					<button
						type="button"
						className="button button--danger"
						onClick={logout}
						aria-label="Изход от профила">
						{translate("logout")}
					</button>
				</div>
			</div>
		</main>
	);
}

export function DashboardPage() {
	return (
		<DashboardLayout
			pages={DASHBOARD_DEMO_PAGES}
			title="QuizDash"
		/>
	);
}
