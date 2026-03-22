interface IconProps {
	"className"?: string;
	"size"?: number;
	"aria-label"?: string;
}

const defaults = {
	"xmlns": "http://www.w3.org/2000/svg",
	"viewBox": "0 0 24 24",
	"fill": "none",
	"stroke": "currentColor",
	"strokeLinecap": "round" as const,
	"strokeLinejoin": "round" as const,
	"aria-hidden": true as const,
	"focusable": "false" as const,
};

export function IconArrowLeft({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2.5"
			className={className}>
			<path d="M19 12H5M12 19l-7-7 7-7" />
		</svg>
	);
}

export function IconArrowRight({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<path d="M5 12h14M12 5l7 7-7 7" />
		</svg>
	);
}

export function IconX({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2.5"
			className={className}>
			<path d="M18 6L6 18M6 6l12 12" />
		</svg>
	);
}

export function IconSun({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<circle
				cx="12"
				cy="12"
				r="4"
			/>
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
		</svg>
	);
}

export function IconMoon({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<path d="M21 12.79A9 9 0 1 1 11.21 3c-.22.7-.34 1.44-.34 2.21a9 9 0 0 0 10.13 8.58z" />
		</svg>
	);
}

export function IconHeart({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
		</svg>
	);
}

export function IconHeartFilled({ className, size = 16 }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
			width={size}
			height={size}
			className={className}>
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
		</svg>
	);
}

export function IconShoppingCart({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<circle
				cx="9"
				cy="21"
				r="1"
			/>
			<circle
				cx="20"
				cy="21"
				r="1"
			/>
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
		</svg>
	);
}

export function IconCheckCircle({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
		</svg>
	);
}

export function IconAlertCircle({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<circle
				cx="12"
				cy="12"
				r="10"
			/>
			<line
				x1="12"
				y1="8"
				x2="12"
				y2="12"
			/>
			<line
				x1="12"
				y1="16"
				x2="12.01"
				y2="16"
			/>
		</svg>
	);
}

export function IconAlertTriangle({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
			<line
				x1="12"
				y1="9"
				x2="12"
				y2="13"
			/>
			<line
				x1="12"
				y1="17"
				x2="12.01"
				y2="17"
			/>
		</svg>
	);
}

export function IconShirt({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
		</svg>
	);
}

export function IconCoffee({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<path d="M18 8h1a4 4 0 010 8h-1" />
			<path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
			<line
				x1="6"
				y1="1"
				x2="6"
				y2="4"
			/>
			<line
				x1="10"
				y1="1"
				x2="10"
				y2="4"
			/>
			<line
				x1="14"
				y1="1"
				x2="14"
				y2="4"
			/>
		</svg>
	);
}

export function IconTag({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
			<line
				x1="7"
				y1="7"
				x2="7.01"
				y2="7"
			/>
		</svg>
	);
}

export function IconHardHat({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<path d="M2 18a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1H3a1 1 0 00-1 1v2z" />
			<path d="M10 10V5a1 1 0 011-1h2a1 1 0 011 1v5" />
			<path d="M4 15v-3a8 8 0 018-8" />
			<path d="M20 15v-3a8 8 0 00-8-8" />
		</svg>
	);
}

export function IconGlobe({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<circle
				cx="12"
				cy="12"
				r="10"
			/>
			<line
				x1="2"
				y1="12"
				x2="22"
				y2="12"
			/>
			<path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
		</svg>
	);
}

export function IconChevronDown({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2.5"
			className={className}>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	);
}

export function IconChevronUp({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2.5"
			className={className}>
			<polyline points="18 15 12 9 6 15" />
		</svg>
	);
}

export function IconLogOut({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line
				x1="21"
				y1="12"
				x2="9"
				y2="12"
			/>
		</svg>
	);
}

export function IconSearch({ className, size = 16 }: IconProps) {
	return (
		<svg
			{...defaults}
			width={size}
			height={size}
			strokeWidth="2"
			className={className}>
			<circle
				cx="11"
				cy="11"
				r="8"
			/>
			<path d="m21 21-4.35-4.35" />
		</svg>
	);
}
