import {
	useState,
	Children,
	useRef,
	type ReactNode,
	type ReactElement,
	type KeyboardEvent,
} from "react";
import { IconChevronDown } from "./Icons";

import "./Accordion.css";

export interface AccordionItemProps {
	title: string;
	children: ReactNode;
	isOpen?: boolean;
	onToggle?: () => void;
	itemId?: string;
}

export function AccordionItem({
	title,
	children,
	isOpen = false,
	onToggle,
	itemId = "item",
}: AccordionItemProps) {
	const buttonId = `${itemId}-button`;
	const bodyId = `${itemId}-body`;

	return (
		<div className="accordion-item">
			<h3 className="accordion-item__heading">
				<button
					id={buttonId}
					type="button"
					className="accordion-item__button"
					aria-expanded={isOpen}
					aria-controls={bodyId}
					onClick={onToggle}>
					{title}
					<IconChevronDown className="accordion-item__icon" />
				</button>
			</h3>

			<div
				id={bodyId}
				role="region"
				aria-labelledby={buttonId}
				hidden={!isOpen}>
				<div className="accordion-item__body">{isOpen && children}</div>
			</div>
		</div>
	);
}

export function Accordion({ children }: { children: ReactNode }) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

	const items = Children.toArray(children) as ReactElement<AccordionItemProps>[];

	function handleKeyDown(e: KeyboardEvent<HTMLElement>, index: number) {
		if (e.key === "ArrowDown") {
			e.preventDefault();

			const next = (index + 1) % items.length;

			buttonRefs.current[next]?.focus();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();

			const prev = (index - 1 + items.length) % items.length;

			buttonRefs.current[prev]?.focus();
		} else if (e.key === "Home") {
			e.preventDefault();

			buttonRefs.current[0]?.focus();
		} else if (e.key === "End") {
			e.preventDefault();

			buttonRefs.current[items.length - 1]?.focus();
		}
	}

	return (
		<div className="accordion">
			{items.map((item, index) => {
				const buttonId = `accordion-${index}-button`;
				const bodyId = `accordion-${index}-body`;

				const isOpen = openIndex === index;

				return (
					<div
						key={index}
						className="accordion-item">
						<h3 className="accordion-item__heading">
							<button
								ref={el => {
									buttonRefs.current[index] = el;
								}}
								id={buttonId}
								type="button"
								className="accordion-item__button"
								aria-expanded={isOpen}
								aria-controls={bodyId}
								onClick={() => setOpenIndex(isOpen ? null : index)}
								onKeyDown={e => handleKeyDown(e, index)}>
								{item.props.title}
								<IconChevronDown className="accordion-item__icon" />
							</button>
						</h3>

						<div
							id={bodyId}
							role="region"
							aria-labelledby={buttonId}
							hidden={!isOpen}>
							<div className="accordion-item__body">{item.props.children}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
