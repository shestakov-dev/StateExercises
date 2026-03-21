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
			<div className="notif-demo">
				<NotificationCount />

				<div className="notif-demo__grid">
					<div className="notif-demo__controls">
						<AddNotificationPanel />

						<ClearAllButton />
					</div>

					<NotificationList />
				</div>
			</div>
		</NotificationProvider>
	);
}
