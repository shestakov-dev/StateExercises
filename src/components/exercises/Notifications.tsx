import {
	createContext,
	useContext,
	useReducer,
	useState,
	type ReactNode,
} from "react";
import {
	IconCheckCircle,
	IconAlertCircle,
	IconAlertTriangle,
	IconX,
} from "../Icons";

import "./Notifications.css";

type NotificationType = "success" | "error" | "warning";

interface Notification {
	id: number;
	type: NotificationType;
	message: string;
}

interface NotificationContextType {
	notifications: Notification[];
	exitingIds: number[];
	addNotification: (type: NotificationType, message: string) => void;
	dismissNotification: (id: number) => void;
	clearAll: () => void;
}

type NotificationAction =
	| {
			type: "ADD";
			id: number;
			notificationType: NotificationType;
			message: string;
	  }
	| { type: "REMOVE"; id: number }
	| { type: "CLEAR_ALL" };

function notificationReducer(
	state: Notification[],
	action: NotificationAction,
): Notification[] {
	switch (action.type) {
		case "ADD":
			return [
				...state,
				{
					id: action.id,
					type: action.notificationType,
					message: action.message,
				},
			];

		case "REMOVE":
			return state.filter(notification => notification.id !== action.id);

		case "CLEAR_ALL":
			return [];
	}
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
	const [notifications, dispatch] = useReducer(notificationReducer, []);

	const [exitingIds, setExitingIds] = useState<number[]>([]);

	const [idCounter, setIdCounter] = useState(0);

	const EXIT_ANIMATION_MS = 220;

	function removeNotification(id: number) {
		dispatch({ type: "REMOVE", id });

		setExitingIds(ids => ids.filter(itemId => itemId !== id));
	}

	function dismissNotification(id: number) {
		setExitingIds(ids => (ids.includes(id) ? ids : [...ids, id]));

		setTimeout(() => removeNotification(id), EXIT_ANIMATION_MS);
	}

	function addNotification(notificationType: NotificationType, message: string) {
		const id = idCounter;

		setIdCounter(previousCounter => previousCounter + 1);

		dispatch({ type: "ADD", id, notificationType, message });

		setTimeout(() => dismissNotification(id), 5000);
	}

	function clearAll() {
		if (notifications.length === 0) {
			return;
		}

		setExitingIds(notifications.map(notification => notification.id));

		setTimeout(() => {
			dispatch({ type: "CLEAR_ALL" });

			setExitingIds([]);
		}, EXIT_ANIMATION_MS);
	}

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				exitingIds,
				addNotification,
				dismissNotification,
				clearAll,
			}}>
			{children}
		</NotificationContext.Provider>
	);
}

function useNotifications(): NotificationContextType {
	const context = useContext(NotificationContext);

	if (!context) {
		throw new Error(
			"useNotifications must be used within a NotificationProvider",
		);
	}

	return context;
}

const NOTIFICATIONS_CONFIG: Record<
	NotificationType,
	{
		background: string;
		border: string;
		iconColor: string;
		label: string;
		Icon: React.FC<{ className?: string; size?: number }>;
	}
> = {
	success: {
		background: "rgba(74,222,128,0.08)",
		border: "rgba(74,222,128,0.3)",
		iconColor: "#4ade80",
		label: "Успех",
		Icon: IconCheckCircle,
	},
	error: {
		background: "rgba(248,113,113,0.08)",
		border: "rgba(248,113,113,0.3)",
		iconColor: "#f87171",
		label: "Грешка",
		Icon: IconAlertCircle,
	},
	warning: {
		background: "rgba(250,204,21,0.08)",
		border: "rgba(250,204,21,0.3)",
		iconColor: "#facc16",
		label: "Внимание",
		Icon: IconAlertTriangle,
	},
};

export function NotificationCount() {
	const { notifications } = useNotifications();

	const count = notifications.length;

	return (
		<div className="notif-count-bar">
			<span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
				Активни известия
			</span>

			<span
				className={`notif-badge ${count > 0 ? "notif-badge--active" : ""}`}
				aria-label={`${count} активни известия`}>
				{count}
			</span>
		</div>
	);
}

export function AddNotificationPanel() {
	const { addNotification } = useNotifications();

	const buttons: Array<{ type: NotificationType; message: string }> = [
		{ type: "success", message: "Операцията е успешна!" },
		{ type: "error", message: "Нещо се обърка! Опитайте отново." },
		{ type: "warning", message: "Внимавайте - действието е необратимо!" },
	];

	return (
		<section
			className="notif-add-panel"
			style={{
				borderRadius: "var(--radius-lg)",
				border: "1px solid var(--border)",
				background: "var(--bg-raised)",
				padding: "1.25rem",
			}}
			aria-label="Добави известие">
			<p className="form-label">Добави известие</p>

			<div className="notif-add-panel__btns">
				{buttons.map(button => {
					const config = NOTIFICATIONS_CONFIG[button.type];

					return (
						<button
							key={button.type}
							type="button"
							className={`button notif-add-btn notif-add-btn--${button.type}`}
							onClick={() => addNotification(button.type, button.message)}
							aria-label={`Добави ${config.label.toLowerCase()} известие`}>
							<config.Icon />

							{config.label}
						</button>
					);
				})}
			</div>

			<p className="notif-hint">Известията изчезват след 5 секунди</p>
		</section>
	);
}

export function NotificationList() {
	const { notifications, exitingIds, dismissNotification } = useNotifications();

	return (
		<section
			className="notif-list-wrap"
			aria-label="Списък с известия"
			aria-live="polite"
			aria-atomic="false"
			role="log">
			{notifications.length === 0 ? (
				<p
					className="notif-empty"
					role="status">
					Няма активни известия.
				</p>
			) : (
				<ul className="notif-list">
					{notifications.map(notification => {
						const config = NOTIFICATIONS_CONFIG[notification.type];

						return (
							<li
								key={notification.id}
								className={`notif-item ${exitingIds.includes(notification.id) ? "notif-item--exiting" : ""}`}
								style={{ background: config.background, borderColor: config.border }}
								role="alert"
								aria-label={`${config.label}: ${notification.message}`}>
								<span
									className="notif-item__icon"
									aria-hidden="true"
									style={{ color: config.iconColor, borderColor: config.border }}>
									<config.Icon size={18} />
								</span>

								<div className="notif-item__body">
									<span
										className="notif-item__type"
										style={{ color: config.iconColor }}>
										{config.label}
									</span>

									<p className="notif-item__msg">{notification.message}</p>
								</div>

								<button
									type="button"
									className="notif-item__close"
									onClick={() => dismissNotification(notification.id)}
									aria-label={`Затвори известие: ${notification.message}`}>
									<IconX />
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}

export function ClearAllButton() {
	const { notifications, clearAll } = useNotifications();

	if (notifications.length === 0) {
		return null;
	}

	return (
		<button
			type="button"
			className="button button--danger notif-clear-btn"
			onClick={clearAll}
			aria-label={`Изчисти всички ${notifications.length} известия`}>
			Изчисти всички ({notifications.length})
		</button>
	);
}
