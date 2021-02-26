const toggleDropdownBtn = document.querySelector('[data-toggle-dropdown-btn]');
const dropdown = document.querySelector('[data-dropdown]');
const overlay = document.querySelector('[data-overlay]');
overlay.addEventListener('click', () => {
	deActivate([overlay]);
	if (dropdown) {
		deActivate([dropdown, toggleDropdownBtn]);
	}
});
if (toggleDropdownBtn) {
	toggleDropdownBtn.addEventListener('click', () => {
		if (dropdown.classList.contains('active')) {
			deActivate([overlay, dropdown, toggleDropdownBtn]);
		} else {
			activate([overlay, dropdown, toggleDropdownBtn]);
		}
	});
}

function activate(elements) {
	elements.forEach((element) => {
		element.classList.add('active');
	});
}

function deActivate(elements) {
	elements.forEach((element) => {
		element.classList.remove('active');
	});
}
