const passwordInput = document.querySelector('[data-signup-password-input]');
const passwordHelpBlock = document.querySelector('[data-password-help-block]');

passwordHelpBlock.style.display = 'none';

passwordInput.addEventListener('input', () => {
	passwordHelpBlock.style.display = 'inline';
});
