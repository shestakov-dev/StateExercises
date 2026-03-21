import { Link } from "@tanstack/react-router";
import {
	difficultyClassModifier,
	stateApproachLabel,
	exercises,
} from "../config/exercises";
import { IconArrowRight } from "../components/Icons";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

export function Home() {
	return (
		<div className="home-page">
			<header className="home-header">
				<div className="home-header__inner">
					<div className="home-header__top">
						<div>
							<h1 className="home-header__title">State Management упражнения</h1>

							<p className="home-header__sub">
								7 задачи · useReducer · Context API · Zustand · Комбинирани подходи
							</p>
						</div>

						<ThemeSwitcher
							compact
							className="home-theme-switcher"
						/>
					</div>
				</div>
			</header>

			<main
				className="home-main"
				id="main-content">
				<nav aria-label="Упражнения">
					<ol className="exercises-list">
						{exercises.map(exercise => (
							<li key={exercise.id}>
								<Link
									to={exercise.path}
									className="exercise-card"
									aria-label={`Упражнение ${exercise.id}: ${exercise.title}, трудност ${exercise.difficulty}, ${stateApproachLabel[exercise.stateApproach]}`}>
									<div
										className="exercise-card__number"
										aria-hidden="true">
										{String(exercise.id).padStart(2, "0")}
									</div>

									<div className="exercise-card__body">
										<h2 className="exercise-card__title">{exercise.title}</h2>
									</div>

									<div className="exercise-card__right">
										<span
											className={`difficulty-badge difficulty-badge--${difficultyClassModifier[exercise.difficulty]}`}
											aria-hidden="true">
											{exercise.difficulty}
										</span>

										<span
											className="topic-tag"
											aria-hidden="true">
											{stateApproachLabel[exercise.stateApproach]}
										</span>
									</div>

									<IconArrowRight className="exercise-card__arrow" />
								</Link>
							</li>
						))}
					</ol>
				</nav>
			</main>
		</div>
	);
}
