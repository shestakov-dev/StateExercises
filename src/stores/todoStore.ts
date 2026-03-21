import { create } from "zustand";

export interface Todo {
	id: number;
	text: string;
	done: boolean;
}

export type FilterType = "all" | "active" | "completed";

export interface TodoStats {
	total: number;
	done: number;
	remaining: number;
}

interface TodoState {
	todos: Todo[];
	filter: FilterType;
	searchQuery: string;

	addTodo: (text: string) => void;
	toggleTodo: (id: number) => void;
	deleteTodo: (id: number) => void;
	setFilter: (filter: FilterType) => void;
	setSearch: (query: string) => void;

	getFilteredTodos: () => Todo[];
	getStats: () => TodoStats;
}

export const useTodoStore = create<TodoState>((set, get) => ({
	todos: [
		{ id: 1, text: "Научи useReducer", done: true },
		{ id: 2, text: "Научи Context API", done: true },
		{ id: 3, text: "Научи Zustand", done: false },
		{ id: 4, text: "Направи проект", done: false },
	],
	filter: "all",
	searchQuery: "",

	addTodo: text => {
		set(previousTodos => ({
			todos: [...previousTodos.todos, { id: Date.now(), text, done: false }],
		}));
	},
	toggleTodo: id => {
		set(previousTodos => ({
			todos: previousTodos.todos.map(todo =>
				todo.id === id ? { ...todo, done: !todo.done } : todo,
			),
		}));
	},
	deleteTodo: id => {
		set(previousTodos => ({
			todos: previousTodos.todos.filter(todo => todo.id !== id),
		}));
	},
	setFilter: filter => {
		set({ filter });
	},
	setSearch: searchQuery => {
		set({ searchQuery });
	},

	getFilteredTodos: () => {
		const { todos, filter, searchQuery } = get();

		let result = todos;

		if (filter === "active") {
			result = result.filter(todo => !todo.done);
		} else if (filter === "completed") {
			result = result.filter(todo => todo.done);
		}

		if (searchQuery.trim()) {
			result = result.filter(todo =>
				todo.text.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		return result;
	},

	getStats: () => {
		const { todos } = get();

		return {
			total: todos.length,
			done: todos.filter(todo => todo.done).length,
			remaining: todos.filter(todo => !todo.done).length,
		};
	},
}));
