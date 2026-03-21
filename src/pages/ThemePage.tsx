import {
	DemoFooter,
	DemoHeader,
	QuizCard,
} from "../components/exercises/Theme";

export function ThemePage() {
	return (
		<div className="theme-demo">
			<DemoHeader />

			<div className="theme-demo-cards">
				<QuizCard
					title="HTML Основи"
					questions={32}
				/>

				<QuizCard
					title="CSS Стилове"
					questions={28}
				/>

				<QuizCard
					title="JavaScript"
					questions={45}
				/>

				<QuizCard
					title="React Hooks"
					questions={20}
				/>
			</div>

			<DemoFooter />
		</div>
	);
}
