import {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	useId,
	type ComponentType,
	type ReactNode,
	type SyntheticEvent,
} from "react";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { IconGlobe, IconLogOut, IconChevronDown } from "../Icons";
import {
	SidebarDrawer,
	HamburgerButton,
	SidebarNavList,
	type SidebarNavListItem,
} from "../SidebarDrawer";

import "./Dashboard.css";

const translations = {
	bg: {
		dashboard: "Табло",
		quizzes: "Тестове",
		settings: "Настройки",
		welcome: "Добре дошли",
		login: "Вход",
		logout: "Изход",
		enterName: "Вашето име",
		completed: "Завършени",
		points: "Точки",
		progress: "Напредък",
		questions: "въпроса",
		complete: "Завършен",
		incomplete: "Незавършен",
		user: "Потребител",
		theme: "Тема",
		dark: "Тъмна",
		light: "Светла",
		showLess: "Виж по-малко",
		showMore: "Виж още",
	},
	en: {
		dashboard: "Dashboard",
		quizzes: "Quizzes",
		settings: "Settings",
		welcome: "Welcome",
		login: "Login",
		logout: "Logout",
		enterName: "Your name",
		completed: "Completed",
		points: "Points",
		progress: "Progress",
		questions: "questions",
		complete: "Done",
		incomplete: "Incomplete",
		user: "User",
		theme: "Theme",
		dark: "Dark",
		light: "Light",
		showLess: "Show less",
		showMore: "Show more",
	},
} as const;

interface DashboardUser {
	name: string;
	role: string;
}

interface AuthContextValue {
	user: DashboardUser | null;
	login: (name: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<DashboardUser | null>(null);

	return (
		<AuthContext.Provider
			value={{
				user,
				login: name => setUser({ name, role: "student" }),
				logout: () => setUser(null),
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useDashboardAuth(): AuthContextValue {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useDashboardAuth must be used within an AuthProvider");
	}

	return context;
}

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations.bg;
type TranslateFunction = (key: TranslationKey) => string;

interface LanguageContextValue {
	language: Language;
	translate: TranslateFunction;
	toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguage] = useState<Language>("bg");

	return (
		<LanguageContext.Provider
			value={{
				language,
				translate: key => translations[language][key],
				toggleLanguage: () =>
					setLanguage(previous => (previous === "bg" ? "en" : "bg")),
			}}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useDashboardLanguage(): LanguageContextValue {
	const context = useContext(LanguageContext);

	if (!context) {
		throw new Error(
			"useDashboardLanguage must be used within a LanguageProvider",
		);
	}

	return context;
}

export interface HeaderUserMenuUser {
	name: string;
	role?: string;
}

interface HeaderUserMenuProps {
	user: HeaderUserMenuUser;
	onLogout: () => void;
	logoutLabel?: string;
}

export function HeaderUserMenu({
	user,
	onLogout,
	logoutLabel = "Изход",
}: HeaderUserMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDetailsElement>(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		function handlePointerDown(event: PointerEvent) {
			const node = menuRef.current;

			if (node && !node.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("pointerdown", handlePointerDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [isOpen]);

	function handleToggle(event: SyntheticEvent<HTMLDetailsElement>) {
		setIsOpen(event.currentTarget.open);
	}

	return (
		<details
			ref={menuRef}
			className="dashboard-user-menu"
			open={isOpen}
			onToggle={handleToggle}>
			<summary
				className="dashboard-user-trigger"
				aria-label={`Меню на ${user.name}`}>
				<span
					className="dashboard-avatar"
					aria-hidden="true">
					{user.name[0].toUpperCase()}
				</span>

				<span className="dashboard-user-trigger__name">{user.name}</span>

				<IconChevronDown
					size={12}
					className={`dashboard-user-trigger__chevron${isOpen ? " dashboard-user-trigger__chevron--open" : ""}`}
				/>
			</summary>

			<div
				className="dashboard-user-dropdown"
				role="menu">
				<div className="dashboard-user-dropdown__info">
					<span className="dashboard-user-dropdown__name">{user.name}</span>

					{user.role && (
						<span className="dashboard-user-dropdown__role">{user.role}</span>
					)}
				</div>

				<div className="dashboard-user-dropdown__divider" />

				<button
					type="button"
					className="dashboard-user-dropdown__logout"
					onClick={onLogout}
					role="menuitem"
					aria-label={`${logoutLabel} (${user.name})`}>
					<IconLogOut size={14} />

					{logoutLabel}
				</button>
			</div>
		</details>
	);
}

export interface DashboardPageConfig {
	key: string;
	getLabel: (translate: TranslateFunction) => string;
	Content: ComponentType;
	requiresAuth?: boolean;
}

interface DashboardLayoutContextValue {
	activePage: string;
	setActivePage: (page: string) => void;
	pages: DashboardPageConfig[];
}

const DashboardLayoutContext =
	createContext<DashboardLayoutContextValue | null>(null);

interface DashboardLayoutProviderProps {
	children: ReactNode;
	pages: DashboardPageConfig[];
	defaultPage?: string;
}

function DashboardLayoutProvider({
	children,
	pages,
	defaultPage,
}: DashboardLayoutProviderProps) {
	const [activePage, setActivePage] = useState(
		defaultPage ?? pages[0]?.key ?? "",
	);

	return (
		<DashboardLayoutContext.Provider value={{ activePage, setActivePage, pages }}>
			{children}
		</DashboardLayoutContext.Provider>
	);
}

function useDashboardLayoutContext(): DashboardLayoutContextValue {
	const context = useContext(DashboardLayoutContext);

	if (!context) {
		throw new Error(
			"useDashboardLayoutContext must be used within DashboardLayoutProvider",
		);
	}

	return context;
}

interface DashboardHeaderProps {
	title?: string;
	isSidebarOpen?: boolean;
	onToggleSidebar?: () => void;
}

function DashboardHeader({
	title = "QuizDash",
	isSidebarOpen = false,
	onToggleSidebar,
}: DashboardHeaderProps) {
	const { user, logout } = useDashboardAuth();
	const { language, translate, toggleLanguage } = useDashboardLanguage();

	return (
		<header
			className="dashboard-header"
			aria-label="Заглавна лента">
			{user && onToggleSidebar && (
				<HamburgerButton
					isOpen={isSidebarOpen}
					onToggle={onToggleSidebar}
					controls="dashboard-sidebar-drawer"
					className="dashboard-hamburger"
				/>
			)}

			<span
				className="dashboard-brand"
				aria-label={title}>
				{title}
			</span>

			<div
				className="dashboard-header-actions"
				style={{ marginLeft: "auto" }}>
				<button
					type="button"
					className="dashboard-header-pill dashboard-lang-switcher"
					onClick={toggleLanguage}
					aria-label={`Смени езика – текущ: ${language === "bg" ? "Български" : "English"}`}
					aria-pressed={language === "en"}>
					<IconGlobe
						size={14}
						className="dashboard-lang-icon"
					/>

					<span className="dashboard-lang-label">{language.toUpperCase()}</span>
				</button>

				<ThemeSwitcher
					compact
					className="dashboard-header-pill"
				/>

				{user && (
					<HeaderUserMenu
						user={user}
						onLogout={logout}
						logoutLabel={translate("logout")}
					/>
				)}
			</div>
		</header>
	);
}

interface DashboardSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
	const { pages, activePage, setActivePage } = useDashboardLayoutContext();
	const { translate } = useDashboardLanguage();

	const navItems: SidebarNavListItem[] = pages.map(({ key, getLabel }) => ({
		key,
		label: getLabel(translate),
	}));

	return (
		<SidebarDrawer
			id="dashboard-sidebar-drawer"
			isOpen={isOpen}
			onClose={onClose}
			className="dashboard-sidebar"
			ariaLabel="Странична навигация">
			<nav aria-label="Странична навигация">
				<SidebarNavList
					items={navItems}
					activeKey={activePage}
					onSelect={key => setActivePage(key)}
				/>
			</nav>
		</SidebarDrawer>
	);
}

function LoginForm() {
	const { login } = useDashboardAuth();
	const { translate } = useDashboardLanguage();

	const [name, setName] = useState("");

	const inputId = useId();

	const MAX_NAME_LENGTH = 24;

	function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();

		const normalized = name.trim().slice(0, MAX_NAME_LENGTH);

		if (normalized) {
			login(normalized);
		}
	}

	return (
		<div className="dashboard-login-wrap">
			<form
				className="dashboard-login-card"
				onSubmit={handleSubmit}
				aria-label="Вход в системата">
				<label
					htmlFor={inputId}
					className="form-label">
					{translate("enterName")}
				</label>

				<input
					id={inputId}
					type="text"
					className="form-input"
					placeholder={translate("enterName")}
					value={name}
					onChange={event => setName(event.target.value.slice(0, MAX_NAME_LENGTH))}
					maxLength={MAX_NAME_LENGTH}
					required
					autoComplete="name"
				/>

				<button
					type="submit"
					className="button button--primary dashboard-login-submit"
					disabled={!name.trim()}
					aria-disabled={!name.trim()}>
					{translate("login")}
				</button>
			</form>
		</div>
	);
}

function DashboardContent() {
	const { pages, activePage } = useDashboardLayoutContext();
	const { user } = useDashboardAuth();

	const currentPage = pages.find(page => page.key === activePage);

	if (!currentPage) {
		return null;
	}

	if (currentPage.requiresAuth && !user) {
		return <LoginForm />;
	}

	const { Content } = currentPage;

	return <Content />;
}

interface DashboardLayoutFrameProps {
	title?: string;
}

function DashboardLayoutFrame({ title }: DashboardLayoutFrameProps) {
	const { user } = useDashboardAuth();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="dashboard-shell">
			<DashboardHeader
				title={title}
				isSidebarOpen={isSidebarOpen}
				onToggleSidebar={() => setIsSidebarOpen(open => !open)}
			/>

			<div className="dashboard-body">
				{user && (
					<DashboardSidebar
						isOpen={isSidebarOpen}
						onClose={() => setIsSidebarOpen(false)}
					/>
				)}

				<DashboardContent />
			</div>
		</div>
	);
}

export interface DashboardLayoutProps {
	pages: DashboardPageConfig[];
	defaultPage?: string;
	title?: string;
}

export function DashboardLayout({
	pages,
	defaultPage,
	title = "QuizDash",
}: DashboardLayoutProps) {
	return (
		<AuthProvider>
			<LanguageProvider>
				<DashboardLayoutProvider
					pages={pages}
					defaultPage={defaultPage}>
					<DashboardLayoutFrame title={title} />
				</DashboardLayoutProvider>
			</LanguageProvider>
		</AuthProvider>
	);
}
