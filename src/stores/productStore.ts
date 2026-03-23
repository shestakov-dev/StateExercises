import { create } from "zustand";

export interface Product {
	id: number;
	name: string;
	price: number;
	category: string;
	imageUrl: string;
}

interface ProductState {
	products: Product[];
	favorites: number[];
	searchQuery: string;
	category: string;
	toggleFavorite: (id: number) => void;
	setSearch: (search: string) => void;
	setCategory: (category: string) => void;
	getFilteredProducts: () => Product[];
	getFavoriteProducts: () => Product[];
	isFavorite: (id: number) => boolean;
}

export const useProductStore = create<ProductState>((set, get) => ({
	products: [
		{
			id: 1,
			name: "React книга",
			price: 45,
			category: "books",
			imageUrl: "https://placehold.co/480x280/e5ecff/233159?text=React+Book",
		},
		{
			id: 2,
			name: "JS тениска",
			price: 30,
			category: "clothing",
			imageUrl: "https://placehold.co/480x280/e4f8ef/1f5136?text=JS+Shirt",
		},
		{
			id: 3,
			name: "CSS стикери",
			price: 5,
			category: "accessories",
			imageUrl: "https://placehold.co/480x280/edf3ff/2d3f72?text=CSS+Stickers",
		},
		{
			id: 4,
			name: "Node.js чаша",
			price: 15,
			category: "accessories",
			imageUrl: "https://placehold.co/480x280/eafaf1/27533f?text=Node+Mug",
		},
		{
			id: 5,
			name: "TypeScript курс",
			price: 99,
			category: "courses",
			imageUrl: "https://placehold.co/480x280/e9f1ff/1f3c6d?text=TS+Course",
		},
		{
			id: 6,
			name: "Vue.js тениска",
			price: 28,
			category: "clothing",
			imageUrl: "https://placehold.co/480x280/e6faef/21513c?text=Vue+Shirt",
		},
	],
	favorites: [],
	searchQuery: "",
	category: "all",

	toggleFavorite: id => {
		set(previousState => ({
			favorites: previousState.favorites.includes(id)
				? previousState.favorites.filter(favorite => favorite !== id)
				: [...previousState.favorites, id],
		}));
	},

	setSearch: searchQuery => set({ searchQuery }),
	setCategory: category => set({ category }),

	getFilteredProducts: () => {
		const { products, searchQuery, category } = get();

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
	},

	getFavoriteProducts: () => {
		const { products, favorites } = get();

		return products.filter(product => favorites.includes(product.id));
	},

	isFavorite: id => get().favorites.includes(id),
}));
