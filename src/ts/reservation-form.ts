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
const reservationSubmitBtn: HTMLButtonElement = reservationForm.querySelector('button[type="submit"]');

/* constants */
const CHECK_ICON_URL: string = './dist/assets/images/icons/icon-check.svg';
const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const DAY_REGEX = /^(0[1-9])|([1-2]\d)|(3[0-1])$/;
const MAX_DAYS_IN_MONTH = 31;
const MONTH_REGEX = /^(0[1-9])|(1[0-2])$/;
const YEAR_REGEX = /^\d{4}$/;
const HOUR_REGEX = /^(0[1-9])|(1[0-2])$/;
const MINUTES_REGEX = /^([0-5]\d)$/;
const MONDAY_CODE = 1;
const FRIDAY_CODE = 5;
const SATURDAY_CODE = 6;
const SUNDAY_CODE = 0;

createCustomSelectOptions();

/* event listeners */
/* --- for custom select */
originalSelect.addEventListener('keyup', (e: KeyboardEvent) => {
	switch (e.key) {
		case 'ArrowUp':
		case 'ArrowDown':
		case 'ArrowLeft':
		case 'ArrowRight':
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

/* --- for reservation form */
reservationSubmitBtn.addEventListener('click', (e: Event) => {
	e.preventDefault();
	validateName();
	validateEmail();
	validateDate();
	validateTime();
});

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

function setMaxPeople(): void {
	const maxValue: number = Number(spinButton.getAttribute('aria-valuemax'));
	updateSpinButton(maxValue);
}

function setMinPeople(): void {
	const minValue: number = Number(spinButton.getAttribute('aria-valuemin'));
	updateSpinButton(minValue);
}

function updateSpinButton(newValue: number): void {
	spinButton.setAttribute('aria-valuenow', newValue.toString());
	spinButton.setAttribute('aria-valuetext', `${newValue} people`);
	spinButton.innerText = `${newValue} people`;
}

/* --- for form validation */
/* --- --- name validation */
function validateName(): boolean {
	const nameValue: string = nameInput.value;

	if (isBlank(nameValue)) return displayFormError(nameInput, 'This field is required');

	return removeFormError(nameInput);
}

/* --- --- email validation */
function validateEmail(): boolean {
	const emailValue: string = emailInput.value;

	if (isBlank(emailValue)) return displayFormError(emailInput, 'This field is required');
	if (!isValidEmail(emailValue)) return displayFormError(emailInput, 'Provide a valid email address');

	return removeFormError(emailInput);
}

function isValidEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

/* --- --- date validation */
function validateDate(): boolean {
	if (validateDay() && validateMonth() && validateYear()) {
		const day: number = Number(dayInput.value);
		const month: number = Number(monthInput.value);
		const year: number = Number(yearInput.value);

		if (!isDateAfterToday(year, month, day)) return displayFormError(yearInput, 'Insert date after today');

		return removeFormError(yearInput);
	}

	return false;
}

function validateDay(): boolean {
	const dayValue: string = dayInput.value;

	if (isBlank(dayValue)) return displayFormError(dayInput, 'This field is incomplete');
	if (!isValidDay(dayValue)) return displayFormError(dayInput, 'Insert valid day value (01 - 31)');
	if (!isDayWithinMonthRange(dayValue)) return displayFormError(dayInput, 'Insert day in range of selected month.');

	return removeFormError(dayInput);
}

function isDateAfterToday(year: number, month: number, day: number): boolean {
	return new Date(year, month - 1, day) > new Date();
}

function isDayWithinMonthRange(day: string): boolean {
	const month: string = monthInput.value;
	const year: string = yearInput.value;

	if (!year || !month) return true;
	const monthDays: number = new Date(Number(year), Number(month), 0).getDate() || MAX_DAYS_IN_MONTH;
	return Number(day) <= monthDays;
}

function validateMonth(): boolean {
	const monthValue: string = monthInput.value;

	if (isBlank(monthValue)) return displayFormError(monthInput, 'This field is incomplete');
	if (!isValidMonth(monthValue)) return displayFormError(monthInput, 'Insert valid month value (01 - 12)');

	return removeFormError(monthInput);
}

function validateYear(): boolean {
	const yearValue: string = yearInput.value;

	if (isBlank(yearValue)) return displayFormError(yearInput, 'This field is incomplete');
	if (!isValidYear(yearValue)) return displayFormError(yearInput, 'Insert valid year (4 digit number)');

	return removeFormError(yearInput);
}

function isValidDay(day: string): boolean {
	return DAY_REGEX.test(day);
}

function isValidMonth(month: string): boolean {
	return MONTH_REGEX.test(month);
}

function isValidYear(year: string): boolean {
	return YEAR_REGEX.test(year);
}

/* --- --- time validation */
function validateTime(): boolean {
	if (validateHour() && validateMinutes()) {
		if (!isTimeBetweenOpenHours()) return displayFormError(hourInput, 'Insert time between open hours');

		return removeFormError(hourInput);
	}

	return false;
}

function isTimeBetweenOpenHours(): boolean {
	const hour: number = Number(hourInput.value);
	const minutes: number = Number(minutesInput.value);
	const date: Date = new Date(Number(yearInput.value), Number(monthInput.value) - 1, Number(dayInput.value));
	const weekDay: number = date.getDay();
	const dayTime: string = originalSelect.value;

	if (Number.isNaN(hour) || Number.isNaN(minutes)) return false;
	if (Number.isNaN(weekDay)) return false;

	if (dayTime === 'am') return isBetweenMorningHours(hour);
	else return isBetweenAfternoonHours(hour, minutes, weekDay);
}

function isBetweenMorningHours(hour: number): boolean {
	return hour >= 9 && hour < 12;
}

function isBetweenAfternoonHours(hour: number, minutes: number, weekDayCode: number): boolean {
	if (weekDayCode <= FRIDAY_CODE && weekDayCode >= MONDAY_CODE) {
		return hour === 12 || hour < 10;
	}
	if (weekDayCode === SATURDAY_CODE || weekDayCode === SUNDAY_CODE) {
		return hour === 12 || hour < 11 || (hour === 11 && minutes < 30);
	}

	return true;
}

function validateHour(): boolean {
	const hourValue: string = hourInput.value;

	if (isBlank(hourValue)) return displayFormError(hourInput, 'This field is incomplete');
	if (!isValidHour(hourValue)) return displayFormError(hourInput, 'Insert valid hour format (01 - 12)');

	return removeFormError(hourInput);
}

function validateMinutes(): boolean {
	const minutesValue: string = minutesInput.value;

	if (isBlank(minutesValue)) return displayFormError(minutesInput, 'This field is incomplete');
	if (!areValidMinutes(minutesValue)) return displayFormError(minutesInput, 'Insert valid minutes format (00 - 59)');

	return removeFormError(minutesInput);
}

function isValidHour(hour: string): boolean {
	return HOUR_REGEX.test(hour);
}

function areValidMinutes(minutes: string): boolean {
	return MINUTES_REGEX.test(minutes);
}

/* --- --- general form validation */
function isBlank(value: string): boolean {
	return value === '';
}
/* --- --- form error displaying */
function displayFormError(input: HTMLInputElement, message: string): boolean {
	let formGroup: HTMLElement = input.closest('.form-group');
	let formError: HTMLElement;

	while (formGroup) {
		formGroup.classList.add('error');
		formError = formGroup.querySelector('.form-error');

		if (formError) {
			formError.innerText = message;
			break;
		}

		formGroup = formGroup.parentElement.closest('.form-group');
	}

	return false;
}

function removeFormError(input: HTMLInputElement): boolean {
	let formGroup: HTMLElement = input.closest('.form-group');
	let formError: HTMLElement;

	while (formGroup) {
		formGroup.classList.remove('error');
		formError = formGroup.querySelector('.form-error');

		if (formError) formError.innerText = '';

		formGroup = formGroup.parentElement.closest('.form-group');
	}

	return true;
}
