const toggleDropdownBtn = document.querySelector('[data-toggle-dropdown-btn]');
const dropdown = document.querySelector('[data-dropdown]');
const overlay = document.querySelector('[data-overlay]');
overlay.addEventListener('click', () => {
	overlay.classList.remove('active');
	if (dropdown) dropdown.classList.remove('active');
});
if (toggleDropdownBtn) {
	toggleDropdownBtn.addEventListener('click', () => {
		if (dropdown.classList.contains('active')) {
			overlay.classList.remove('active');
			dropdown.classList.remove('active');
		} else {
			overlay.classList.add('active');
			dropdown.classList.add('active');
		}
	});
}
