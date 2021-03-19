const LOCAL_STORAGE_KEY = 'projectSharingSite.theme';

const toggleCheckbox = document.querySelector('[data-toggle-theme-checkbox]');
const themeStylesheet = document.querySelector('[data-theme-stylesheet]');

setTheme(localStorage.getItem(LOCAL_STORAGE_KEY) || 'light');
if (toggleCheckbox) {
	toggleCheckbox.addEventListener('change', () => changeTheme());
	setCheckbox();
}

function changeTheme() {
	if (toggleCheckbox.checked) {
		setTheme('dark');
	} else {
		setTheme('light');
	}
}

function setTheme(theme) {
	localStorage.setItem(LOCAL_STORAGE_KEY, theme);
	themeStylesheet.href = `/stylesheets/${theme}-theme.css`;
}

function setCheckbox() {
	if (localStorage.getItem(LOCAL_STORAGE_KEY) === 'dark') toggleCheckbox.checked = true;
	else toggleCheckbox.checked = false;
}
