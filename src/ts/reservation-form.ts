/* custom select elements */
const customSelect: HTMLElement = document.querySelector('.custom-select');
const originalSelect: HTMLSelectElement = customSelect.querySelector('select');
const originalSelectOptions: Array<HTMLOptionElement> = Array.from(originalSelect.querySelectorAll('option'));
const customSelectFocus: HTMLElement = customSelect.querySelector('.custom-select__focus');
const customSelectFocusText: HTMLElement = customSelectFocus.querySelector('span');
const customSelectOptionsContainer: HTMLElement = customSelect.querySelector('.custom-select__options');
let customSelectOptions: Array<HTMLElement> = [];

/* spinbutton elements */
const customSpinbutton: HTMLElement = document.querySelector('.spinbutton');
const spinButton: HTMLElement = customSpinbutton.querySelector('[role="spinbutton"]');
const decreaseSpinbutton: HTMLButtonElement = customSpinbutton.querySelector('#decrease-people');
const increaseSpinbutton: HTMLButtonElement = customSpinbutton.querySelector('#increase-people');

/* form elements */
const reservationForm: HTMLFormElement = document.querySelector('.reservation-form');
const nameInput: HTMLInputElement = reservationForm.querySelector('input[name="name"]');
const emailInput: HTMLInputElement = reservationForm.querySelector('input[name="email"]');
const monthInput: HTMLInputElement = reservationForm.querySelector('input[name="month"]');
const dayInput: HTMLInputElement = reservationForm.querySelector('input[name="day"]');
const yearInput: HTMLInputElement = reservationForm.querySelector('input[name="year"]');
const hourInput: HTMLInputElement = reservationForm.querySelector('input[name="hour"]');
const minutesInput: HTMLInputElement = reservationForm.querySelector('input[name="minute"]');

/* constants */
const CHECK_ICON_URL: string = './dist/assets/images/icons/icon-check.svg';

createCustomSelectOptions();

/* event listeners */
/* --- for custom select */
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

/* --- for spinbutton */
spinButton.addEventListener('keydown', handleSpinButton);
increaseSpinbutton.addEventListener('click', increasePeople);
decreaseSpinbutton.addEventListener('click', decreasePeople);

/* helper functions */
/* --- for custom select */
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

/* --- for spinbutton */
function handleSpinButton(e: KeyboardEvent): void {
	switch (e.key) {
		case 'ArrowUp':
			e.preventDefault();
			increasePeople();
			break;
		case 'ArrowDown':
			e.preventDefault();
			decreasePeople();
			break;
		case 'Home':
			e.preventDefault();
			setMinPeople();
			break;
		case 'End':
			e.preventDefault();
			setMaxPeople();
			break;
	}
}

function increasePeople(): void {
	const currentValue: number = Number(spinButton.getAttribute('aria-valuenow'));
	const maxValue: number = Number(spinButton.getAttribute('aria-valuemax'));
	const newValue: number = Math.min(currentValue + 1, maxValue);
	updateSpinButton(newValue);
}

function decreasePeople(): void {
	const currentValue: number = Number(spinButton.getAttribute('aria-valuenow'));
	const minValue: number = Number(spinButton.getAttribute('aria-valuemin'));
	const newValue: number = Math.max(currentValue - 1, minValue);
	updateSpinButton(newValue);
}

function setMaxPeople() {
	const maxValue: number = Number(spinButton.getAttribute('aria-valuemax'));
	updateSpinButton(maxValue);
}

function setMinPeople() {
	const minValue: number = Number(spinButton.getAttribute('aria-valuemin'));
	updateSpinButton(minValue);
}

function updateSpinButton(newValue: number): void {
	spinButton.setAttribute('aria-valuenow', newValue.toString());
	spinButton.setAttribute('aria-valuetext', `${newValue} people`);
	spinButton.innerText = `${newValue} people`;
}

/* --- for form validation */
function isBlank(value: string): boolean {
	return value !== '';
}
