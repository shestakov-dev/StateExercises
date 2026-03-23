export interface CartLine<Product> {
	product: Product;
	quantity: number;
}

export function addOrIncrementItem<Product, Id>(
	items: CartLine<Product>[],
	product: Product,
	getId: (product: Product) => Id,
): CartLine<Product>[] {
	const id = getId(product);

	const existing = items.find(item => getId(item.product) === id);

	if (!existing) {
		return [...items, { product, quantity: 1 }];
	}

	return items.map(item =>
		getId(item.product) === id ? { ...item, quantity: item.quantity + 1 } : item,
	);
}

export function removeItemById<Product, Id>(
	items: CartLine<Product>[],
	id: Id,
	getId: (product: Product) => Id,
): CartLine<Product>[] {
	return items.filter(item => getId(item.product) !== id);
}

export function updateItemQuantity<Product, Id>(
	items: CartLine<Product>[],
	id: Id,
	quantity: number,
	getId: (product: Product) => Id,
	minQuantity: number,
): CartLine<Product>[] {
	const updated = items.map(item =>
		getId(item.product) === id ? { ...item, quantity } : item,
	);

	return updated.filter(item => item.quantity > minQuantity);
}
