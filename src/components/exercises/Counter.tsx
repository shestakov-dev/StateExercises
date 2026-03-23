import { useReducer, useId } from "react";

import "./Counter.css";

interface CounterState {
	count: number;
	history: Array<{ previous: number; label: string; result: number }>;
}

type CounterAction =
	| { type: "INCREMENT" }
	| { type: "DECREMENT" }
	| { type: "RESET" }
	| { type: "INCREMENT_BY"; payload: number };

function counterReducer(
	state: CounterState,
	action: CounterAction,
): CounterState {
	switch (action.type) {
		case "INCREMENT":
			return {
				count: state.count + 1,
				history: [
					...state.history,
					{ previous: state.count, label: "+1", result: state.count + 1 },
				],
			};

		case "DECREMENT":
			return {
				count: state.count - 1,
				history: [
					...state.history,
					{ previous: state.count, label: "−1", result: state.count - 1 },
				],
			};

		case "RESET":
			return {
				count: 0,
				history: [
					...state.history,
					{ previous: state.count, label: "reset", result: 0 },
				],
			};

		case "INCREMENT_BY":
			return {
				count: state.count + action.payload,
				history: [
					...state.history,
					{
						previous: state.count,
						label: `+${action.payload}`,
						result: state.count + action.payload,
					},
				],
			};
	}
}

const INITIAL: CounterState = { count: 0, history: [] };

export function Counter() {
	const [state, dispatch] = useReducer(counterReducer, INITIAL);

	const historyId = useId();
	const countId = useId();

	return (
		<div className="counter-demo">
			<section
				className="counter-display"
				aria-labelledby={countId}>
				<h2
					id={countId}
					className="visually-hidden">
					Стойност на брояча
				</h2>

				<p
					className="counter-number"
					aria-live="polite"
					aria-atomic="true"
					aria-label={`Текуща стойност: ${state.count}`}>
					{state.count}
				</p>

				<div
					className="counter-controls"
					role="group"
					aria-label="Основни контроли">
					<button
						type="button"
						className="button counter-btn counter-btn--dec"
						onClick={() => dispatch({ type: "DECREMENT" })}
						aria-label="Намали с 1">
						−1
					</button>
					<button
						type="button"
						className="button counter-btn counter-btn--reset"
						onClick={() => dispatch({ type: "RESET" })}
						aria-label="Нулирай брояча">
						Нулиране
					</button>
					<button
						type="button"
						className="button counter-btn counter-btn--inc"
						onClick={() => dispatch({ type: "INCREMENT" })}
						aria-label="Увеличи с 1">
						+1
					</button>
				</div>

				<div
					className="counter-by-row"
					role="group"
					aria-label="Увеличи с фиксирана стойност">
					{[5, 10, 25, 50].map(n => (
						<button
							key={n}
							type="button"
							className="button button--sm counter-by-btn"
							onClick={() => dispatch({ type: "INCREMENT_BY", payload: n })}
							aria-label={`Увеличи с ${n}`}>
							+{n}
						</button>
					))}
				</div>
			</section>

			<section
				className="counter-history"
				aria-labelledby={historyId}>
				<div className="counter-history__head">
					<h2
						id={historyId}
						className="counter-history__title">
						История на действията
					</h2>
					{state.history.length > 0 && (
						<span
							className="counter-history__count"
							aria-label={`${state.history.length} действия`}>
							{state.history.length}
						</span>
					)}
				</div>

				{state.history.length === 0 ? (
					<p
						className="counter-history__empty"
						role="status">
						Все още няма действия.
					</p>
				) : (
					<div className="counter-history__table-wrap">
						<table
							className="counter-history__table"
							aria-label="История на действията">
							<thead>
								<tr>
									<th scope="col">Стара стойност</th>
									<th
										scope="col"
										className="counter-history__col-operation"
										aria-label="Операция"
									/>
									<th
										scope="col"
										className="counter-history__col-separator"
										aria-label="Равно"
									/>
									<th scope="col">Нова стойност</th>
								</tr>
							</thead>
							<tbody>
								{[...state.history].reverse().map((entry, i) => (
									<tr key={i}>
										<td className="counter-history__cell counter-history__cell--value">
											{entry.previous}
										</td>
										{entry.label === "reset" ? (
											<td
												className="counter-history__cell counter-history__cell--operation"
												colSpan={2}>
												Нулиране
											</td>
										) : (
											<>
												<td className="counter-history__cell counter-history__cell--operation">
													{entry.label}
												</td>
												<td className="counter-history__cell counter-history__cell--separator">
													=
												</td>
											</>
										)}
										<td className="counter-history__cell counter-history__cell--value counter-history__cell--value-new">
											{entry.result}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</div>
	);
}
