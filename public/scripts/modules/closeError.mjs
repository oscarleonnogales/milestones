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

export { closeErrorButton, closeErrorDiv };
