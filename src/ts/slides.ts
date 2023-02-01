const slideTabButtons: Array<HTMLButtonElement> = Array.from(document.querySelectorAll('.tab-button'));

const handleButtonExpansion = (button: HTMLButtonElement, shouldExpand: boolean = false): void => {
	const targetIds: string[] = button.getAttribute('aria-controls').split(' ');
	button.setAttribute('aria-expanded', shouldExpand.toString());
	handleControlledElements(targetIds, shouldExpand);
};

const handleControlledElements = (ids: string[], shouldExpand: boolean): void => {
	ids.forEach(id => {
		const element: HTMLElement = document.querySelector(`#${id}`);
		if (element) handleElementExpansion(element, shouldExpand);
	});
};

const handleElementExpansion = (element: HTMLElement, shouldExpand: boolean) => {
	element.dataset.expanded = shouldExpand.toString();
	if (shouldExpand) {
		element.classList.add('fade-in-animation');
		element.addEventListener('animationend', () => element.classList.remove('fade-in-animation'), { once: true });
	}
};

const handleTabButton = (e: Event): void => {
	const button: HTMLButtonElement = e.target as HTMLButtonElement;

	slideTabButtons.forEach(btn => handleButtonExpansion(btn, btn === button));
};

slideTabButtons.forEach(button => button.addEventListener('click', handleTabButton));
