import { createFileRoute } from "@tanstack/react-router";
import { ExerciseLayout } from "../../layouts/ExerciseLayout";

export const Route = createFileRoute("/exercises/$exerciseId")({
	component: ExerciseRouteComponent,
});

function ExerciseRouteComponent() {
	const { exerciseId: exerciseIdString } = Route.useParams();

	const exerciseId = parseInt(exerciseIdString);

	if (isNaN(exerciseId)) {
		return <div>Невалиден идентификатор на упражнение</div>;
	}

	return <ExerciseLayout exerciseId={exerciseId} />;
}
