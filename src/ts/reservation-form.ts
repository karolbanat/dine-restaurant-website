const customSelect: HTMLElement = document.querySelector('.custom-select');
const originalSelect: HTMLSelectElement = customSelect.querySelector('select');
const originalSelectOptions: Array<HTMLOptionElement> = Array.from(originalSelect.querySelectorAll('option'));

const customSelectOptionsContainer: HTMLElement = customSelect.querySelector('.custom-select__options');

const CHECK_ICON_URL: string = './dist/assets/images/icons/icon-check.svg';

createCustomSelectOptions();

function createCustomSelectOptions(): void {
	originalSelectOptions.forEach(option => {
		customSelectOptionsContainer.appendChild(createCustomOption(option));
	});
}

function createCustomOption(option: HTMLOptionElement): HTMLElement {
	const optionWrapper = document.createElement('span');
	optionWrapper.classList.add('custom-select__option');
	optionWrapper.setAttribute('data-selected', option.selected.toString());
	optionWrapper.setAttribute('data-value', option.value);

	const checkImage = document.createElement('img');
	checkImage.setAttribute('src', CHECK_ICON_URL);
	checkImage.setAttribute('alt', '');

	const optionText = document.createElement('span');
	optionText.innerText = option.innerText;

	optionWrapper.appendChild(checkImage);
	optionWrapper.appendChild(optionText);

	return optionWrapper;
}
