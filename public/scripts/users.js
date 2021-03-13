const dropdownSearchFormBtn = document.querySelector('[data-dropdown-search-form-btn]');
const searchForm = document.querySelector('[data-search-users-form]');

const caretDown = document.querySelector('[data-caret-down]');
const caretUp = document.querySelector('[data-caret-up]');

dropdownSearchFormBtn.addEventListener('click', () => {
	if (searchForm.classList.contains('active')) {
		caretUp.style.display = 'none';
		caretDown.style.display = 'inline';
	} else {
		caretUp.style.display = 'inline';
		caretDown.style.display = 'none';
	}
	searchForm.classList.toggle('active');
});
