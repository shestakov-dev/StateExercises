import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
	difficultyClassModifier,
	stateApproachLabel,
	getExerciseById,
} from "../config/exercises";
import { IconArrowLeft } from "../components/Icons";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

interface ExerciseLayoutProps {
	exerciseId: number;
	children: ReactNode;
}

export function ExerciseLayout({ exerciseId, children }: ExerciseLayoutProps) {
	const exercise = getExerciseById(exerciseId);

	if (!exercise) {
		return <div>Упражнението не е намерено</div>;
	}

	const {
		id,
		title,
		difficulty,
		stateApproach,
		description,
		hint,
		codeExample,
	} = exercise;

	return (
		<div className="exercise-page">
			<a
				href="#main-content"
				className="skip-link">
				Прескочи към съдържанието
			</a>

			<header className="exercise-topbar">
				<div className="exercise-topbar__inner">
					<nav aria-label="Хлебни трохи">
						<Link
							to="/"
							className="exercise-topbar__back"
							aria-label="Назад към всички упражнения">
							<IconArrowLeft />
							<span className="exercise-topbar__back-label">Всички упражнения</span>
						</Link>
					</nav>

					<div
						className="exercise-topbar__sep"
						aria-hidden="true"
					/>

					<span
						className="exercise-topbar__label"
						aria-hidden="true">
						{title}
					</span>

					<ThemeSwitcher
						compact
						className="exercise-topbar__theme"
					/>
				</div>
			</header>

			<div className="exercise-body">
				<aside
					className="exercise-aside"
					aria-label="Описание на задачата">
					<p className="exercise-aside__number">Задача {id}</p>

					<h1 className="exercise-aside__title">{title}</h1>

					<div className="exercise-aside__meta">
						<span
							className={`difficulty-badge difficulty-badge--${difficultyClassModifier[difficulty]}`}
							aria-label={`Трудност: ${difficulty}`}>
							{difficulty}
						</span>

						<span className="topic-tag">{stateApproachLabel[stateApproach]}</span>
					</div>

					<div
						className="exercise-aside__rule"
						aria-hidden="true"
					/>

					<dl className="exercise-aside__details">
						<div className="exercise-aside__detail-group">
							<dt className="exercise-aside__section">Описание</dt>

							<dd className="exercise-aside__desc">
								<p>{description}</p>

								{codeExample && (
									<pre
										className="exercise-aside__code"
										tabIndex={0}
										role="region"
										aria-label="Примерен код">
										<code>{codeExample}</code>
									</pre>
								)}
							</dd>
						</div>
					</dl>

					{hint && (
						<div
							className="exercise-aside__hint"
							role="note"
							aria-label="Подсказка">
							<p className="exercise-aside__hint-label">Подсказка</p>

							<p>{hint}</p>
						</div>
					)}
				</aside>

				<section
					id="main-content"
					className="exercise-demo"
					aria-label="Демо на задачата"
					tabIndex={-1}>
					<p
						className="exercise-demo__label"
						aria-hidden="true">
						Демо
					</p>

					{children}
				</section>
			</div>
		</div>
	);
}
