function resolveLocale(locale?: string): string {
	if (locale) {
		return locale;
	}

	try {
		return new Intl.NumberFormat().resolvedOptions().locale ?? "en";
	} catch {
		return "en";
	}
}

export function formatPrice(amount: number, locale?: string): string {
	return new Intl.NumberFormat(resolveLocale(locale), {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}

export function formatCompactPrice(amount: number, locale?: string): string {
	return new Intl.NumberFormat(resolveLocale(locale), {
		style: "currency",
		currency: "EUR",
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(amount);
}

export function formatLineTotal(
	unitPrice: number,
	quantity: number,
	locale?: string,
): string {
	return formatCompactPrice(unitPrice * quantity, locale);
}
