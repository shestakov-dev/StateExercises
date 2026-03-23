import {
	AddNotificationPanel,
	ClearAllButton,
	NotificationCount,
	NotificationList,
	NotificationProvider,
} from "../components/exercises/Notifications";

export function NotificationsPage() {
	return (
		<NotificationProvider>
			<div className="notification-demo">
				<NotificationCount />

				<div className="notification-demo__grid">
					<div className="notification-demo__controls">
						<AddNotificationPanel />

						<ClearAllButton />
					</div>

					<NotificationList />
				</div>
			</div>
		</NotificationProvider>
	);
}
