import {
	AddTodoForm,
	FilterButtons,
	SearchInput,
	Stats,
	TodoList,
} from "../components/exercises/Todo";

export function TodoPage() {
	return (
		<div className="todo-demo">
			<Stats />

			<div className="todo-main">
				<AddTodoForm />

				<div
					style={{
						margin: "1rem 0",
						height: "1px",
						background: "var(--border)",
					}}
				/>

				<div className="todo-controls">
					<SearchInput />

					<FilterButtons />
				</div>

				<TodoList />
			</div>
		</div>
	);
}
