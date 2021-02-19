const LOCAL_STORAGE_KEY = 'projectSharingSite.theme';

const toggleButton = document.querySelector('[data-toggle-theme-button]');
const themeStylesheet = document.querySelector('[data-theme-stylesheet]');

toggleButton.addEventListener('click', () => changeTheme());

setTheme(localStorage.getItem(LOCAL_STORAGE_KEY));

function changeTheme() {
	console.log(localStorage.getItem(LOCAL_STORAGE_KEY));
	if (localStorage.getItem(LOCAL_STORAGE_KEY) == 'dark') {
		setTheme('light');
	} else {
		setTheme('dark');
	}
}

function setTheme(theme) {
	localStorage.setItem(LOCAL_STORAGE_KEY, theme);
	themeStylesheet.href = `/stylesheets/${theme}-theme.css`;
}
