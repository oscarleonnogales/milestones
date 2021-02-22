// Inputs
const usernameInput = document.querySelector('[data-username-input]');
const passwordInput = document.querySelector('[data-signup-password-input]');
const confirmInput = document.querySelector('[data-confirm-input]');

// Icons
const usernameIcon = document.querySelector('[data-username-input-icon]');
const passwordIcon = document.querySelector('[data-password-input-icon]');
const confirmIcon = document.querySelector('[data-confirm-input-icon]');

const passwordHelpBlock = document.querySelector('[data-password-help-block]');
passwordHelpBlock.style.display = 'none';

usernameInput.addEventListener('input', () => {
	usernameIcon.classList.add('active');
});

passwordInput.addEventListener('input', () => {
	passwordHelpBlock.style.display = 'inline';
	passwordIcon.classList.add('active');
});

confirmInput.addEventListener('input', () => {
	confirmIcon.classList.add('active');
});
