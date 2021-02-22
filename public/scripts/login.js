const loginInput = document.querySelector('[data-login-input]');
const loginInputIcon = document.querySelector('[data-login-input-icon]');
const passwordInput = document.querySelector('[data-password-input]');
const passwordInputIcon = document.querySelector('[data-password-input-icon]');

const closeErrorButton = document.querySelector('[data-close-error-btn]');
const closeErrorDiv = document.querySelector('[data-close-error-div]');
closeErrorButton.addEventListener('click', () => {
	closeErrorDiv.style.display = 'none';
});

loginInput.addEventListener('input', () => {
	if (loginInput.value != '') {
		loginInputIcon.classList.add('active');
	} else {
		loginInputIcon.classList.remove('active');
	}
});

passwordInput.addEventListener('input', () => {
	if (passwordInput.value != '') {
		passwordInputIcon.classList.add('active');
	} else {
		passwordInputIcon.classList.remove('active');
	}
});
