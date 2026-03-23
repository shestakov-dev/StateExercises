import { IconX, IconHeart, IconHeartFilled } from "../Icons";
import {
	formatPrice,
	formatLineTotal,
	formatCompactPrice,
} from "../../utils/currency";
import { type Product } from "../../stores/productStore";

import "./ShoppingCart.css";

const PRODUCT_CATEGORIES = [
	{ key: "all", label: "Всички" },
	{ key: "books", label: "Книги" },
	{ key: "courses", label: "Курсове" },
	{ key: "clothing", label: "Дрехи" },
	{ key: "accessories", label: "Аксесоари" },
] as const;

function toTitleCase(value: string): string {
	return value
		.split(/[-_\s]+/)
		.filter(Boolean)
		.map(part => part[0].toUpperCase() + part.slice(1).toLowerCase())
		.join(" ");
}

function getProductCategoryLabel(category: string): string {
	return (
		PRODUCT_CATEGORIES.find(item => item.key === category)?.label ??
		toTitleCase(category)
	);
}

interface CartItemRowProps {
	name: string;
	unitPrice: number;
	quantity: number;
	imageUrl?: string;
	onUpdateQuantity: (quantity: number) => void;
	onRemove: () => void;
}

export function CartItemRow({
	name,
	unitPrice,
	quantity,
	imageUrl,
	onUpdateQuantity,
	onRemove,
}: CartItemRowProps) {
	return (
		<li className={`cart-item${imageUrl ? " cart-item--with-thumb" : ""}`}>
			{imageUrl && (
				<img
					className="cart-item__thumb"
					src={imageUrl}
					alt=""
					loading="lazy"
					decoding="async"
				/>
			)}

			<div className="cart-item__content">
				<div className="cart-item__main">
					<div className="cart-item__info">
						<p className="cart-item__name">{name}</p>

						<p className="cart-item__base-price">{formatPrice(unitPrice)}</p>
					</div>

					<button
						type="button"
						className="button button--sm button--ghost cart-item__remove"
						onClick={onRemove}
						aria-label={`Премахни ${name} от количката`}>
						<IconX size={14} />
					</button>
				</div>

				<div
					className="cart-item__quantity-row"
					role="group"
					aria-label={`Количество за ${name}`}>
					<div className="cart-item__quantity-controls">
						<button
							type="button"
							className="quantity-btn"
							onClick={() => onUpdateQuantity(quantity - 1)}
							aria-label={`Намали ${name}`}>
							−
						</button>

						<input
							type="number"
							className="cart-item__quantity-input"
							min={0}
							step={1}
							value={quantity}
							onChange={e => {
								const parsed = Number.parseInt(e.target.value, 10);

								onUpdateQuantity(Number.isNaN(parsed) ? quantity : parsed);
							}}
							aria-label={`Количество за ${name}`}
						/>

						<button
							type="button"
							className="quantity-btn"
							onClick={() => onUpdateQuantity(quantity + 1)}
							aria-label={`Увеличи ${name}`}>
							+
						</button>
					</div>

					<p className="cart-item__subtotal">
						{formatLineTotal(unitPrice, quantity)}
					</p>
				</div>
			</div>
		</li>
	);
}

interface CartSummaryProps {
	totalItems: number;
	totalPrice: number;
	onClear: () => void;
	checkoutLabel?: string;
	checkoutDisabled?: boolean;
}

export function CartSummary({
	totalItems,
	totalPrice,
	onClear,
	checkoutLabel = "Поръчай",
	checkoutDisabled = false,
}: CartSummaryProps) {
	return (
		<footer className="cart-summary">
			<dl className="cart-summary__stats">
				<div>
					<dt>Артикули</dt>

					<dd>{totalItems}</dd>
				</div>

				<div className="cart-summary__total">
					<dt>Общо</dt>

					<dd>{formatCompactPrice(totalPrice)}</dd>
				</div>
			</dl>

			<button
				type="button"
				className="button button--primary cart-summary__checkout"
				disabled={totalItems === 0 || checkoutDisabled}
				aria-disabled={totalItems === 0 || checkoutDisabled}>
				{checkoutLabel}
			</button>

			{totalItems > 0 && (
				<button
					type="button"
					className="button button--danger cart-summary__checkout"
					onClick={onClear}
					aria-label="Изчисти цялата количка">
					Изчисти
				</button>
			)}
		</footer>
	);
}

interface ProductCatalogCardProps {
	product: Product;
	cartQuantity: number;
	onAdd: (product: Product) => void;
	isFavorite?: boolean;
	onToggleFavorite?: (id: number) => void;
}

export function ProductCatalogCard({
	product,
	cartQuantity,
	onAdd,
	isFavorite,
	onToggleFavorite,
}: ProductCatalogCardProps) {
	const addLabel = cartQuantity > 0 ? `+ Добави (${cartQuantity})` : "+ Добави";

	const showFavorite = typeof isFavorite === "boolean" && !!onToggleFavorite;

	return (
		<article
			className="ecommerce-product-card"
			aria-label={`${product.name}, цена ${formatPrice(product.price)}${cartQuantity > 0 ? `, ${cartQuantity} в количката` : ""}`}>
			<div className="ecommerce-product-top">
				<img
					className="ecommerce-product-image"
					src={product.imageUrl}
					alt={product.name}
					loading="lazy"
					decoding="async"
				/>

				{showFavorite && (
					<button
						type="button"
						className={`ecommerce-fav-btn${isFavorite ? " ecommerce-fav-btn--active" : ""}`}
						onClick={() => onToggleFavorite(product.id)}
						aria-pressed={isFavorite}
						aria-label={
							isFavorite
								? `Премахни ${product.name} от любими`
								: `Добави ${product.name} към любими`
						}>
						{isFavorite ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
					</button>
				)}

				{cartQuantity > 0 && (
					<span
						className="shop-quantity-badge"
						aria-hidden="true">
						{cartQuantity}
					</span>
				)}
			</div>

			<div className="ecommerce-product-body">
				<p className="ecommerce-product-name">{product.name}</p>

				<div className="ecommerce-product-meta">
					<span className="ecommerce-category-badge">
						{getProductCategoryLabel(product.category)}
					</span>

					<span className="ecommerce-product-price">{formatPrice(product.price)}</span>
				</div>

				<div className="ecommerce-product-footer">
					<button
						type="button"
						className="button button--primary button--sm ecommerce-add-btn"
						onClick={() => onAdd(product)}
						aria-label={`Добави ${product.name} в количката`}>
						{addLabel}
					</button>
				</div>
			</div>
		</article>
	);
}
