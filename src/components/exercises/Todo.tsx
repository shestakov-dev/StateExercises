import { useState, useId, type KeyboardEvent } from "react";
import { useTodoStore, type FilterType } from "../../stores/todoStore";
import { IconX, IconSearch } from "../Icons";

export function Stats() {
	const { total, done, remaining } = useTodoStore(store => store.getStats());
	const completionPercentage = total > 0 ? Math.round((done / total) * 100) : 0;

	return (
		<section
			className="todo-stats"
			aria-label="Статистики">
			<div className="todo-stats__numbers">
				<div
					className="todo-stat"
					aria-label={`Завършени: ${done}`}>
					<span
						className="todo-stat__val"
						style={{ color: "var(--green)" }}>
						{done}
					</span>

					<span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
						завършени
					</span>
				</div>

				<div
					className="todo-stat"
					aria-label={`Оставащи: ${remaining}`}>
					<span
						className="todo-stat__val"
						style={{ color: "var(--red)" }}>
						{remaining}
					</span>

					<span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
						оставащи
					</span>
				</div>

				<div
					className="todo-stat"
					aria-label={`Общо: ${total}`}>
					<span
						className="todo-stat__val"
						style={{ color: "var(--text-primary)" }}>
						{total}
					</span>

					<span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
						общо
					</span>
				</div>
			</div>

			<div
				className="todo-progress"
				role="progressbar"
				aria-valuenow={completionPercentage}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label={`${done} от ${total} завършени (${completionPercentage}%)`}>
				<div className="todo-progress__track">
					<div
						className="todo-progress__fill"
						style={{ width: `${completionPercentage}%` }}
					/>
				</div>

				<span className="todo-progress__label">{completionPercentage}%</span>
			</div>
		</section>
	);
}

export function AddTodoForm() {
	const addTodo = useTodoStore(store => store.addTodo);

	const [text, setText] = useState("");

	const inputId = useId();

	function submit() {
		if (text.trim()) {
			addTodo(text.trim());

			setText("");
		}
	}

	function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			submit();
		}
	}

	return (
		<div className="todo-add-form">
			<label
				htmlFor={inputId}
				className="visually-hidden">
				Нова задача
			</label>

			<input
				id={inputId}
				type="text"
				className="form-input"
				placeholder="Нова задача…"
				value={text}
				onChange={e => setText(e.target.value)}
				onKeyDown={handleKeyDown}
				aria-label="Текст на новата задача"
			/>

			<button
				type="button"
				className="button button--primary todo-add-btn"
				onClick={submit}
				disabled={!text.trim()}
				aria-disabled={!text.trim()}
				aria-label="Добави задача">
				<span className="todo-add-btn__text">Добави</span>

				<span
					className="todo-add-btn__icon"
					aria-hidden="true">
					+
				</span>
			</button>
		</div>
	);
}

export function SearchInput() {
	const searchQuery = useTodoStore(store => store.searchQuery);
	const setSearch = useTodoStore(store => store.setSearch);

	const inputId = useId();

	return (
		<div>
			<label
				htmlFor={inputId}
				className="form-label">
				Търси задачи
			</label>

			<div className="search-field">
				<IconSearch className="search-field__icon" />

				<input
					id={inputId}
					type="search"
					className="search-field__input"
					placeholder="Търси…"
					value={searchQuery}
					onChange={e => setSearch(e.target.value)}
					autoComplete="off"
				/>
			</div>
		</div>
	);
}

export function FilterButtons() {
	const filter = useTodoStore(store => store.filter);
	const setFilter = useTodoStore(store => store.setFilter);

	const options: Array<{ key: FilterType; label: string }> = [
		{ key: "all", label: "Всички" },
		{ key: "active", label: "Активни" },
		{ key: "completed", label: "Завършени" },
	];

	return (
		<div
			className="todo-filters"
			role="group"
			aria-label="Филтри за задачите">
			{options.map(({ key, label }) => (
				<button
					key={key}
					type="button"
					className={`button button--ghost todo-filter-btn ${
						filter === key ? "todo-filter-btn--active" : ""
					}`}
					onClick={() => setFilter(key)}
					aria-pressed={filter === key}>
					{label}
				</button>
			))}
		</div>
	);
}

function TodoItem({
	id,
	text,
	done,
}: {
	id: number;
	text: string;
	done: boolean;
}) {
	const toggleTodo = useTodoStore(store => store.toggleTodo);
	const deleteTodo = useTodoStore(store => store.deleteTodo);

	const checkId = useId();

	return (
		<li className={`todo-item ${done ? "todo-item--done" : ""}`}>
			<input
				type="checkbox"
				id={checkId}
				className="todo-item__check"
				checked={done}
				onChange={() => toggleTodo(id)}
				aria-label={`${done ? "Маркирай като незавършено" : "Маркирай като завършено"}: ${text}`}
			/>

			<label
				htmlFor={checkId}
				className="todo-item__text"
				style={{ textDecoration: done ? "line-through" : "none" }}>
				{text}
			</label>

			<button
				type="button"
				className="todo-item__delete"
				onClick={() => deleteTodo(id)}
				aria-label={`Изтрий задача: ${text}`}>
				<IconX size={14} />
			</button>
		</li>
	);
}

export function TodoList() {
	const filteredTodos = useTodoStore(store => store.getFilteredTodos());

	return (
		<>
			<p
				className="visually-hidden"
				aria-live="polite"
				aria-atomic="true">
				{filteredTodos.length === 0
					? "Няма намерени задачи"
					: `${filteredTodos.length} ${filteredTodos.length === 1 ? "задача намерена" : "задачи намерени"}`}
			</p>

			{filteredTodos.length === 0 ? (
				<p
					className="todo-empty"
					role="status">
					Няма намерени задачи
				</p>
			) : (
				<ul
					className="todo-list"
					aria-label="Задачи">
					{filteredTodos.map(todo => (
						<TodoItem
							key={todo.id}
							id={todo.id}
							text={todo.text}
							done={todo.done}
						/>
					))}
				</ul>
			)}
		</>
	);
}
