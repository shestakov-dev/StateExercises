import { EcommerceContent } from "../components/exercises/Ecommerce";
import { EcommerceProvider } from "../contexts/ecommerce";

export function EcommercePage() {
	return (
		<EcommerceProvider>
			<EcommerceContent />
		</EcommerceProvider>
	);
}
