import { useRef, type KeyboardEvent, type ReactNode } from "react";

import "./SidebarDrawer.css";

interface HamburgerButtonProps {
	isOpen: boolean;
	onToggle: () => void;
	controls?: string;
	className?: string;
}

export function HamburgerButton({
	isOpen,
	onToggle,
	controls,
	className = "",
}: HamburgerButtonProps) {
	return (
		<button
			type="button"
			className={`hamburger-btn${className ? ` ${className}` : ""}`}
			onClick={onToggle}
			aria-label={isOpen ? "Затвори менюто" : "Отвори менюто"}
			aria-controls={controls}
			aria-expanded={isOpen}>
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</button>
	);
}

interface SidebarDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	id?: string;
	ariaLabel?: string;
	className?: string;
}

export function SidebarDrawer({
	isOpen,
	onClose,
	children,
	id,
	ariaLabel,
	className = "",
}: SidebarDrawerProps) {
	return (
		<>
			<button
				type="button"
				className={`sidebar-drawer-backdrop${isOpen ? " sidebar-drawer-backdrop--open" : ""}`}
				onClick={onClose}
				aria-label="Затвори менюто"
				tabIndex={isOpen ? 0 : -1}
			/>

			<aside
				id={id}
				className={`sidebar-drawer${isOpen ? " sidebar-drawer--open" : ""}${className ? ` ${className}` : ""}`}
				aria-label={ariaLabel}>
				{children}
			</aside>
		</>
	);
}

export interface SidebarNavListItem<Key extends string = string> {
	key: Key;
	label: string;
	icon?: ReactNode;
	count?: number;
}

interface SidebarNavListProps<Key extends string = string> {
	items: SidebarNavListItem<Key>[];
	activeKey: Key;
	onSelect: (key: Key) => void;
	itemClassName?: string;
}

export function SidebarNavList<Key extends string = string>({
	items,
	activeKey,
	onSelect,
	itemClassName = "dashboard-nav-item",
}: SidebarNavListProps<Key>) {
	const navButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	function registerRef(key: string, button: HTMLButtonElement | null) {
		navButtonRefs.current[key] = button;
	}

	function handleKeyDown(
		event: KeyboardEvent<HTMLButtonElement>,
		index: number,
	) {
		const lastIndex = items.length - 1;
		let nextIndex = index;

		switch (event.key) {
			case "ArrowDown":
			case "ArrowRight":
				nextIndex = index === lastIndex ? 0 : index + 1;
				break;

			case "ArrowUp":
			case "ArrowLeft":
				nextIndex = index === 0 ? lastIndex : index - 1;
				break;

			case "Home":
				nextIndex = 0;
				break;

			case "End":
				nextIndex = lastIndex;
				break;

			default:
				return;
		}

		event.preventDefault();

		const nextItem = items[nextIndex];

		if (!nextItem) {
			return;
		}

		onSelect(nextItem.key);

		navButtonRefs.current[nextItem.key]?.focus();
	}

	return (
		<ul>
			{items.map((item, index) => (
				<li key={item.key}>
					<button
						type="button"
						className={`${itemClassName}${activeKey === item.key ? ` ${itemClassName}--active` : ""}`}
						onClick={() => onSelect(item.key)}
						onKeyDown={event => handleKeyDown(event, index)}
						ref={button => registerRef(item.key, button)}
						tabIndex={activeKey === item.key ? 0 : -1}
						aria-current={activeKey === item.key ? "page" : undefined}>
						{item.icon}

						<span>{item.label}</span>

						{(item.count ?? 0) > 0 && (
							<span className="ecom-tab-badge">{item.count}</span>
						)}
					</button>
				</li>
			))}
		</ul>
	);
}
