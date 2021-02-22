const loginInput = document.querySelector('[data-login-input]');
const loginInputIcon = document.querySelector('[data-login-input-icon]');
const passwordInput = document.querySelector('[data-password-input]');
const passwordInputIcon = document.querySelector('[data-password-input-icon]');

loginInput.addEventListener('input', () => {
	loginInputIcon.classList.add('active');
});

passwordInput.addEventListener('input', () => {
	passwordInputIcon.classList.add('active');
});
