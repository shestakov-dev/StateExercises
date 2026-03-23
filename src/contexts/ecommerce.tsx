import {
	createContext,
	useContext,
	useMemo,
	useReducer,
	useState,
	type Dispatch,
	type ReactNode,
} from "react";
import type { Product } from "../stores/productStore";
import {
	addOrIncrementItem,
	removeItemById,
	updateItemQuantity,
	type CartLine,
} from "../utils/cart";

export interface EcommerceUser {
	email: string;
	name: string;
}

interface EcommerceAuthContextValue {
	user: EcommerceUser | null;
	login: (email: string) => void;
	logout: () => void;
}

interface EcommerceCartState {
	items: CartLine<Product>[];
}

export type EcommerceCartAction =
	| { type: "ADD_ITEM"; product: Product }
	| { type: "REMOVE_ITEM"; id: number }
	| { type: "UPDATE_QUANTITY"; id: number; quantity: number }
	| { type: "CLEAR_CART" };

interface EcommerceCartContextValue {
	cart: EcommerceCartState;
	dispatch: Dispatch<EcommerceCartAction>;
}

const EcommerceAuthContext = createContext<EcommerceAuthContextValue | null>(
	null,
);
const EcommerceCartContext = createContext<EcommerceCartContextValue | null>(
	null,
);

function ecommerceCartReducer(
	state: EcommerceCartState,
	action: EcommerceCartAction,
): EcommerceCartState {
	switch (action.type) {
		case "ADD_ITEM":
			return {
				items: addOrIncrementItem(
					state.items,
					action.product,
					product => product.id,
				),
			};
		case "REMOVE_ITEM":
			return {
				items: removeItemById(state.items, action.id, product => product.id),
			};
		case "UPDATE_QUANTITY":
			return {
				items: updateItemQuantity(
					state.items,
					action.id,
					action.quantity,
					product => product.id,
					0,
				),
			};
		case "CLEAR_CART":
			return { items: [] };
	}
}

export function EcommerceProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<EcommerceUser | null>(null);
	const [cart, dispatch] = useReducer(ecommerceCartReducer, { items: [] });

	const authValue = useMemo(
		() => ({
			user,
			login: (email: string) => setUser({ email, name: email.split("@")[0] }),
			logout: () => setUser(null),
		}),
		[user],
	);

	const cartValue = useMemo(() => ({ cart, dispatch }), [cart]);

	return (
		<EcommerceAuthContext.Provider value={authValue}>
			<EcommerceCartContext.Provider value={cartValue}>
				{children}
			</EcommerceCartContext.Provider>
		</EcommerceAuthContext.Provider>
	);
}

export function useEcommerceAuth() {
	const context = useContext(EcommerceAuthContext);

	if (!context) {
		throw new Error("useEcommerceAuth must be used within an EcommerceProvider");
	}

	return context;
}

export function useEcommerceCart() {
	const context = useContext(EcommerceCartContext);

	if (!context) {
		throw new Error("useEcommerceCart must be used within an EcommerceProvider");
	}

	return context;
}
