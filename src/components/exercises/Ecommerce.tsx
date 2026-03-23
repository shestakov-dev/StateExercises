import {
	useId,
	useMemo,
	useState,
	type Dispatch,
	type SyntheticEvent,
} from "react";
import { useProductStore, type Product } from "../../stores/productStore";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { IconShoppingCart, IconTag, IconHeart, IconSearch } from "../Icons";
import { CartItemRow, CartSummary, ProductCatalogCard } from "./ShoppingCart";
import { HeaderUserMenu, type HeaderUserMenuUser } from "./Dashboard";
import {
	HamburgerButton,
	SidebarDrawer,
	SidebarNavList,
	type SidebarNavListItem,
} from "../SidebarDrawer";
import {
	useEcommerceAuth,
	useEcommerceCart,
	type EcommerceCartAction,
} from "../../contexts/ecommerce";
import { useShallow } from "zustand/react/shallow";

import "./Ecommerce.css";

type TabKey = "products" | "cart" | "favorites";

interface NavBarProps {
	onToggleSidebar: () => void;
	isSidebarOpen: boolean;
}

function NavBar({ onToggleSidebar, isSidebarOpen }: NavBarProps) {
	const { user, logout } = useEcommerceAuth();

	const userMenuUser: HeaderUserMenuUser | null = user
		? { name: user.name }
		: null;

	return (
		<header
			className="ecommerce-navbar"
			aria-label="Навигационна лента">
			<div className="ecommerce-navbar-left">
				<HamburgerButton
					isOpen={isSidebarOpen}
					onToggle={onToggleSidebar}
					controls="ecommerce-sidebar"
					className="ecommerce-hamburger"
				/>

				<span
					className="ecommerce-brand"
					aria-label="DevShop">
					DevShop
				</span>
			</div>

			<div className="ecommerce-nav-actions">
				<ThemeSwitcher
					compact
					className="dashboard-header-pill"
				/>

				{userMenuUser && (
					<HeaderUserMenu
						user={userMenuUser}
						onLogout={logout}
					/>
				)}
			</div>
		</header>
	);
}

interface EcommerceSidebarProps {
	activeTab: TabKey;
	setActiveTab: (tab: TabKey) => void;
	cartCount: number;
	favoritesCount: number;
	isSidebarOpen: boolean;
	onClose: () => void;
}

function EcommerceSidebar({
	activeTab,
	setActiveTab,
	cartCount,
	favoritesCount,
	isSidebarOpen,
	onClose,
}: EcommerceSidebarProps) {
	const navItems: SidebarNavListItem<TabKey>[] = [
		{ key: "products", label: "Продукти", icon: <IconTag /> },
		{
			key: "cart",
			label: "Количка",
			icon: <IconShoppingCart />,
			count: cartCount,
		},
		{
			key: "favorites",
			label: "Любими",
			icon: <IconHeart />,
			count: favoritesCount,
		},
	];

	return (
		<SidebarDrawer
			id="ecommerce-sidebar"
			isOpen={isSidebarOpen}
			onClose={onClose}
			className="ecommerce-sidebar"
			ariaLabel="Навигация в магазина">
			<nav>
				<SidebarNavList
					items={navItems}
					activeKey={activeTab}
					onSelect={tab => setActiveTab(tab)}
				/>
			</nav>
		</SidebarDrawer>
	);
}

const CATEGORIES = [
	{ key: "all", label: "Всички" },
	{ key: "books", label: "Книги" },
	{ key: "courses", label: "Курсове" },
	{ key: "clothing", label: "Дрехи" },
	{ key: "accessories", label: "Аксесоари" },
] as const;

interface ProductsTabProps {
	onAddToCart: (product: Product) => void;
	getCartQuantity: (id: number) => number;
}

function ProductsTab({ onAddToCart, getCartQuantity }: ProductsTabProps) {
	const {
		products,
		favorites,
		toggleFavorite,
		searchQuery,
		setSearch,
		category,
		setCategory,
	} = useProductStore(
		useShallow(
			({
				products,
				favorites,
				toggleFavorite,
				searchQuery,
				setSearch,
				category,
				setCategory,
			}) => ({
				products,
				favorites,
				toggleFavorite,
				searchQuery,
				setSearch,
				category,
				setCategory,
			}),
		),
	);

	const inputId = useId();

	const filteredProducts = useMemo(() => {
		let result = products;

		if (category !== "all") {
			result = result.filter(product => product.category === category);
		}

		if (searchQuery.trim()) {
			result = result.filter(product =>
				product.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		return result;
	}, [products, searchQuery, category]);

	return (
		<div className="ecommerce-products-tab">
			<div className="search-wrapper">
				<label
					htmlFor={inputId}
					className="visually-hidden">
					Търси продукти
				</label>

				<div className="search-field">
					<IconSearch className="search-field__icon" />

					<input
						id={inputId}
						type="search"
						className="search-field__input"
						placeholder="Търси продукти…"
						value={searchQuery}
						onChange={event => setSearch(event.target.value)}
						autoComplete="off"
					/>
				</div>
			</div>

			<div
				className="ecommerce-cat-filter"
				role="group"
				aria-label="Филтър по категория">
				{CATEGORIES.map(({ key, label }) => (
					<button
						key={key}
						type="button"
						className={`button button--sm ecommerce-cat-btn${category === key ? " ecommerce-cat-btn--active" : ""}`}
						onClick={() => setCategory(key)}
						aria-pressed={category === key}>
						{label}
					</button>
				))}
			</div>

			{filteredProducts.length === 0 ? (
				<p
					className="ecommerce-no-results"
					role="status">
					Няма намерени продукти.
				</p>
			) : (
				<ul
					className="ecommerce-product-grid"
					aria-label="Продукти">
					{filteredProducts.map(product => (
						<li key={product.id}>
							<ProductCatalogCard
								product={product}
								onAdd={onAddToCart}
								cartQuantity={getCartQuantity(product.id)}
								isFavorite={favorites.includes(product.id)}
								onToggleFavorite={toggleFavorite}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

function EcommerceLoginForm() {
	const { login } = useEcommerceAuth();

	const [email, setEmail] = useState("");

	const inputId = useId();

	const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

	function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();

		if (isValid) {
			login(email);

			setEmail("");
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
					Имейл адрес
				</label>

				<input
					id={inputId}
					type="email"
					className="form-input"
					placeholder="email@example.com"
					value={email}
					onChange={event => setEmail(event.target.value)}
					autoComplete="email"
					required
				/>

				<button
					type="submit"
					className="button button--primary dashboard-login-submit"
					disabled={!isValid}
					aria-disabled={!isValid}>
					Вход
				</button>
			</form>
		</div>
	);
}

interface CartTabProps {
	items: Array<{ product: Product; quantity: number }>;
	dispatch: Dispatch<EcommerceCartAction>;
}

function CartTab({ items, dispatch }: CartTabProps) {
	const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

	const totalPrice = items.reduce(
		(sum, item) => sum + item.product.price * item.quantity,
		0,
	);

	return (
		<div className="ecommerce-cart-tab">
			<h2 className="shop-section-title">
				Количка
				{totalQuantity > 0 && (
					<span
						className="cart-panel__count"
						aria-label={`${totalQuantity} артикула`}>
						{totalQuantity}
					</span>
				)}
			</h2>

			{items.length === 0 ? (
				<p
					className="cart-empty"
					role="status">
					Количката е празна
				</p>
			) : (
				<ul
					className="cart-items-list"
					aria-label="Продукти в количката">
					{items.map(item => (
						<CartItemRow
							key={item.product.id}
							name={item.product.name}
							unitPrice={item.product.price}
							quantity={item.quantity}
							imageUrl={item.product.imageUrl}
							onUpdateQuantity={quantity =>
								dispatch({
									type: "UPDATE_QUANTITY",
									id: item.product.id,
									quantity: quantity,
								})
							}
							onRemove={() => dispatch({ type: "REMOVE_ITEM", id: item.product.id })}
						/>
					))}
				</ul>
			)}

			<CartSummary
				totalItems={totalQuantity}
				totalPrice={totalPrice}
				onClear={() => dispatch({ type: "CLEAR_CART" })}
				checkoutLabel="Поръчай"
			/>
		</div>
	);
}

interface FavoritesTabProps {
	onAddToCart: (product: Product) => void;
	getCartQuantity: (id: number) => number;
}

function FavoritesTab({ onAddToCart, getCartQuantity }: FavoritesTabProps) {
	const { toggleFavorite, products, favorites } = useProductStore(
		useShallow(state => ({
			toggleFavorite: state.toggleFavorite,
			products: state.products,
			favorites: state.favorites,
		})),
	);

	const favoriteProducts = useMemo(
		() => products.filter(product => favorites.includes(product.id)),
		[products, favorites],
	);

	return (
		<div className="ecommerce-favorites-tab">
			<h2 className="shop-section-title">
				Любими
				{favoriteProducts.length > 0 && (
					<span className="cart-panel__count">{favoriteProducts.length}</span>
				)}
			</h2>

			{favoriteProducts.length === 0 ? (
				<p
					className="cart-empty"
					role="status">
					Няма запазени любими. Добавете продукти от таба „Продукти".
				</p>
			) : (
				<ul
					className="ecommerce-product-grid"
					aria-label="Любими продукти">
					{favoriteProducts.map(product => (
						<li key={product.id}>
							<ProductCatalogCard
								product={product}
								onAdd={onAddToCart}
								cartQuantity={getCartQuantity(product.id)}
								isFavorite={favorites.includes(product.id)}
								onToggleFavorite={toggleFavorite}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export function EcommerceContent() {
	const { cart, dispatch } = useEcommerceCart();
	const { user } = useEcommerceAuth();

	const [activeTab, setActiveTab] = useState<TabKey>("products");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

	const favCount = useProductStore(store => store.favorites.length);

	function getCartQuantity(productId: number): number {
		return cart.items.find(item => item.product.id === productId)?.quantity ?? 0;
	}

	function handleAddToCart(product: Product) {
		dispatch({ type: "ADD_ITEM", product });

		setIsSidebarOpen(false);
	}

	return (
		<div className="ecommerce-shell">
			<NavBar
				onToggleSidebar={() => setIsSidebarOpen(open => !open)}
				isSidebarOpen={isSidebarOpen}
			/>

			<div className="ecommerce-layout">
				<EcommerceSidebar
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					cartCount={cartCount}
					favoritesCount={favCount}
					isSidebarOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
				/>

				<div className="ecommerce-tab-content">
					{activeTab === "products" && (
						<ProductsTab
							onAddToCart={handleAddToCart}
							getCartQuantity={getCartQuantity}
						/>
					)}

					{(activeTab === "cart" || activeTab === "favorites") && !user && (
						<EcommerceLoginForm />
					)}

					{activeTab === "cart" && user && (
						<CartTab
							items={cart.items}
							dispatch={dispatch}
						/>
					)}

					{activeTab === "favorites" && user && (
						<FavoritesTab
							onAddToCart={handleAddToCart}
							getCartQuantity={getCartQuantity}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
