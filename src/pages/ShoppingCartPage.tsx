import { Accordion, AccordionItem } from "../components/Accordion";
import {
	CartItemRow,
	CartSummary,
	ProductCatalogCard,
} from "../components/exercises/ShoppingCart";
import { EcommerceProvider, useEcommerceCart } from "../contexts/ecommerce";
import { useProductStore } from "../stores/productStore";

function ShoppingCartPageContent() {
	const { cart, dispatch } = useEcommerceCart();

	const products = useProductStore(store => store.products);

	const totalItems = cart.items.reduce(
		(total, currentItem) => total + currentItem.quantity,
		0,
	);

	const totalPrice = cart.items.reduce(
		(total, currentItem) =>
			total + currentItem.product.price * currentItem.quantity,
		0,
	);

	function quantityInCart(id: number) {
		return cart.items.find(item => item.product.id === id)?.quantity ?? 0;
	}

	return (
		<div className="shop-layout">
			<section
				className="cart-panel"
				aria-label="Количка">
				<h2 className="shop-section-title">
					Количка
					{totalItems > 0 && (
						<span
							className="cart-panel__count"
							aria-label={`${totalItems} артикула`}>
							{totalItems}
						</span>
					)}
				</h2>

				{cart.items.length === 0 ? (
					<p
						className="cart-empty"
						role="status">
						Количката е празна
					</p>
				) : (
					<ul
						className="cart-items-list"
						aria-label="Продукти в количката">
						{cart.items.map(item => (
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
										quantity,
									})
								}
								onRemove={() => dispatch({ type: "REMOVE_ITEM", id: item.product.id })}
							/>
						))}
					</ul>
				)}

				<CartSummary
					totalItems={totalItems}
					totalPrice={totalPrice}
					onClear={() => dispatch({ type: "CLEAR_CART" })}
				/>
			</section>

			<Accordion>
				<AccordionItem title={`Каталог с продукти (${products.length})`}>
					<ul
						className="shop-product-grid shop-catalog-grid"
						aria-label="Продукти">
						{products.map(product => (
							<li key={product.id}>
								<ProductCatalogCard
									product={product}
									cartQuantity={quantityInCart(product.id)}
									onAdd={selectedProduct =>
										dispatch({ type: "ADD_ITEM", product: selectedProduct })
									}
								/>
							</li>
						))}
					</ul>
				</AccordionItem>
			</Accordion>
		</div>
	);
}

export function ShoppingCartPage() {
	return (
		<EcommerceProvider>
			<ShoppingCartPageContent />
		</EcommerceProvider>
	);
}
