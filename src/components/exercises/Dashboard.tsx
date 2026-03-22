import {
	createContext,
	useContext,
	useState,
	useEffect,
	useId,
	useRef,
	type ReactNode,
} from "react";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { IconGlobe, IconLogOut, IconChevronDown } from "../Icons";

interface User {
	name: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	login: (name: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

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

export function useDashboardAuth(): AuthContextType {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}

const translations = {
	bg: {
		dashboard: "Табло",
		quizzes: "Тестове",
		settings: "Настройки",
		welcome: "Добре дошли",
		login: "Вход",
		logout: "Изход",
		enterName: "Вашето име",
	},
	en: {
		dashboard: "Dashboard",
		quizzes: "Quizzes",
		settings: "Settings",
		welcome: "Welcome",
		login: "Login",
		logout: "Logout",
		enterName: "Your name",
	},
} as const;

export type LanguageKey = keyof typeof translations.bg;
export type TranslateFunction = (key: LanguageKey) => string;

interface LanguageContextValue {
	language: "bg" | "en";
	translate: TranslateFunction;
	toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguage] = useState<keyof typeof translations>("bg");

	return (
		<LanguageContext.Provider
			value={{
				language,
				translate: key => translations[language][key],
				toggleLanguage: () =>
					setLanguage(previousLanguage => (previousLanguage === "bg" ? "en" : "bg")),
			}}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useDashboardLanguage(): LanguageContextValue {
	const context = useContext(LanguageContext);

	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}

	return context;
}

export interface DashboardPageConfig {
	key: string;
	getLabel: (translate: TranslateFunction) => string;
	Content: React.ComponentType;
	requiresAuth?: boolean;
}

interface DashboardLayoutContextValue {
	activePage: string;
	setActivePage: (page: string) => void;
	pages: DashboardPageConfig[];
}

const DashboardLayoutContext =
	createContext<DashboardLayoutContextValue | null>(null);

function useDashboardLayoutContext(): DashboardLayoutContextValue {
	const context = useContext(DashboardLayoutContext);

	if (!context) {
		throw new Error(
			"useDashboardLayoutContext must be used within DashboardLayout",
		);
	}

	return context;
}

function DashboardHeader({ title = "QuizDash" }: { title?: string }) {
	const { user, logout } = useDashboardAuth();
	const { language, translate, toggleLanguage } = useDashboardLanguage();

	const [isOpen, setIsOpen] = useState(false);

	function handleToggle(event: React.SyntheticEvent<HTMLDetailsElement>) {
		setIsOpen(event.currentTarget.open);
	}

	function handleBlur(event: React.FocusEvent<HTMLDetailsElement>) {
		if (!event.currentTarget.contains(event.relatedTarget)) {
			event.currentTarget.open = false;
		}
	}

	useEffect(() => {
		setIsOpen(false);
	}, [user]);

	function handleLogout() {
		setIsOpen(false);

		logout();
	}

	return (
		<header
			className="dashboard-header"
			aria-label="Заглавна лента">
			<span
				className="dashboard-name"
				aria-label={title}>
				{title}
			</span>

			<div className="dashboard-header-actions">
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
					<details
						className="dashboard-user-menu"
						onToggle={handleToggle}
						onBlur={handleBlur}>
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

								<span className="dashboard-user-dropdown__role">{user.role}</span>
							</div>

							<div className="dashboard-user-dropdown__divider" />

							<button
								type="button"
								className="dashboard-user-dropdown__logout"
								onClick={handleLogout}
								role="menuitem"
								aria-label={`${translate("logout")} (${user.name})`}>
								<IconLogOut size={14} />

								{translate("logout")}
							</button>
						</div>
					</details>
				)}
			</div>
		</header>
	);
}

function DashboardSidebar() {
	const { pages, activePage, setActivePage } = useDashboardLayoutContext();
	const { translate } = useDashboardLanguage();

	const navButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	function registerNavButtonRef(key: string, button: HTMLButtonElement | null) {
		navButtonRefs.current[key] = button;
	}

	function handleSidebarKeyDown(
		event: React.KeyboardEvent<HTMLButtonElement>,
		index: number,
	) {
		const lastIndex = pages.length - 1;
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

		const nextPage = pages[nextIndex];

		if (!nextPage) {
			return;
		}

		setActivePage(nextPage.key);
		navButtonRefs.current[nextPage.key]?.focus();
	}

	return (
		<nav
			className="dashboard-sidebar"
			aria-label="Странична навигация">
			<ul>
				{pages.map(({ key, getLabel }, index) => (
					<li key={key}>
						<button
							type="button"
							className={`dashboard-nav-item${activePage === key ? " dashboard-nav-item--active" : ""}`}
							onClick={() => setActivePage(key)}
							onKeyDown={event => handleSidebarKeyDown(event, index)}
							ref={button => registerNavButtonRef(key, button)}
							tabIndex={activePage === key ? 0 : -1}
							aria-current={activePage === key ? "page" : undefined}>
							{getLabel(translate)}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
}

function LoginForm() {
	const { login } = useDashboardAuth();
	const { translate } = useDashboardLanguage();

	const [name, setName] = useState("");

	const inputId = useId();

	const MAX_LOGIN_NAME_LENGTH = 24;

	function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();

		const normalizedName = name.trim().slice(0, MAX_LOGIN_NAME_LENGTH);

		if (normalizedName) {
			login(normalizedName);
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
					onChange={event =>
						setName(event.target.value.slice(0, MAX_LOGIN_NAME_LENGTH))
					}
					maxLength={MAX_LOGIN_NAME_LENGTH}
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

interface DashboardLayoutProps {
	pages: DashboardPageConfig[];
	defaultPage?: string;
	title?: string;
}

function DashboardLayoutFrame({ title }: Pick<DashboardLayoutProps, "title">) {
	const { user } = useDashboardAuth();

	return (
		<div className="dashboard-shell">
			<DashboardHeader title={title} />

			<div className="dashboard-body">
				{user && <DashboardSidebar />}
				<DashboardContent />
			</div>
		</div>
	);
}

export function DashboardLayout({
	pages,
	defaultPage,
	title = "QuizDash",
}: DashboardLayoutProps) {
	const [activePage, setActivePage] = useState(
		defaultPage ?? pages[0]?.key ?? "",
	);

	return (
		<AuthProvider>
			<LanguageProvider>
				<DashboardLayoutContext.Provider
					value={{ activePage, setActivePage, pages }}>
					<DashboardLayoutFrame title={title} />
				</DashboardLayoutContext.Provider>
			</LanguageProvider>
		</AuthProvider>
	);
}
