const customSelect: HTMLElement = document.querySelector('.custom-select');
const originalSelect: HTMLSelectElement = customSelect.querySelector('select');
const originalSelectOptions: Array<HTMLOptionElement> = Array.from(originalSelect.querySelectorAll('option'));

const customSelectFocus: HTMLElement = customSelect.querySelector('.custom-select__focus');
const customSelectFocusText: HTMLElement = customSelectFocus.querySelector('span');
const customSelectOptionsContainer: HTMLElement = customSelect.querySelector('.custom-select__options');
let customSelectOptions: Array<HTMLElement> = [];

const CHECK_ICON_URL: string = './dist/assets/images/icons/icon-check.svg';

createCustomSelectOptions();

/* event listeners */
originalSelect.addEventListener('keyup', (e: KeyboardEvent) => {
	switch (e.key) {
		case 'ArrowUp':
		case 'ArrowDown':
			handleSelection();
			break;
		case 'Enter':
			handleSelection();
			closeCustomSelect();
			break;
	}
});

customSelectFocus.addEventListener('click', (e: Event) => {
	originalSelect.focus();
});

originalSelect.addEventListener('focusin', openCustomSelect);

/* helper functions */
function createCustomSelectOptions(): void {
	originalSelectOptions.forEach(option => {
		const customOption: HTMLElement = createCustomOption(option);
		customSelectOptions.push(customOption);
		customSelectOptionsContainer.appendChild(customOption);
	});
}

function createCustomOption(option: HTMLOptionElement): HTMLElement {
	const optionWrapper = document.createElement('span');
	optionWrapper.classList.add('custom-select__option');
	optionWrapper.setAttribute('data-selected', option.selected.toString());
	optionWrapper.setAttribute('data-value', option.value);
	optionWrapper.addEventListener('click', handleCustomOption);

	const checkImage = document.createElement('img');
	checkImage.setAttribute('src', CHECK_ICON_URL);
	checkImage.setAttribute('alt', '');

	const optionText = document.createElement('span');
	optionText.innerText = option.innerText;

	optionWrapper.appendChild(checkImage);
	optionWrapper.appendChild(optionText);

	return optionWrapper;
}

function handleCustomOption(e: Event): void {
	const option: HTMLElement = e.target as HTMLElement;
	originalSelectOptions.forEach(opt => (opt.selected = opt.value === option.dataset.value));
	handleSelection();
	closeCustomSelect();
}

function handleSelection(): void {
	const selectedValue: string = originalSelectOptions.filter(opt => opt.selected)[0].value;
	customSelectFocusText.innerText = selectedValue.toUpperCase();
	customSelectOptions.forEach(option => {
		option.dataset.selected = (option.dataset.value === selectedValue).toString();
	});
}

function openCustomSelect(): void {
	customSelect.dataset.open = 'true';
}

function closeCustomSelect(): void {
	customSelect.dataset.open = 'false';
}
