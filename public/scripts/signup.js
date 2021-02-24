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

const closeErrorButton = document.querySelector('[data-close-error-btn]');
const closeErrorDiv = document.querySelector('[data-close-error-div]');

if (closeErrorDiv) {
	closeErrorDiv.addEventListener('mouseenter', () => {
		closeErrorButton.style.display = 'inline-block';
	});
	closeErrorDiv.addEventListener('mouseleave', () => {
		closeErrorButton.style.display = 'none';
	});
	closeErrorButton.addEventListener('click', () => {
		closeErrorDiv.style.display = 'none';
	});
}

usernameInput.addEventListener('input', () => {
	if (usernameInput.value != '') {
		usernameIcon.classList.add('active');
	} else {
		usernameIcon.classList.remove('active');
	}
});

passwordInput.addEventListener('input', () => {
	passwordHelpBlock.style.display = 'inline';
	if (passwordInput.value != '') {
		passwordIcon.classList.add('active');
	} else {
		passwordIcon.classList.remove('active');
	}
});

confirmInput.addEventListener('input', () => {
	if (confirmInput.value != '') {
		confirmIcon.classList.add('active');
	} else {
		confirmIcon.classList.remove('active');
	}
});
