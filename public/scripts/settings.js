const passwordDropdownBtn = document.querySelector('[data-password-btn]');
const caretDownPassword = document.querySelector('[data-caret-down-password]');
const caretUpPassword = document.querySelector('[data-caret-up-password]');
const passwordForm = document.querySelector('[data-password-form]');

const locationDropdownBtn = document.querySelector('[data-location-btn]');
const caretDownLocation = document.querySelector('[data-caret-down-location]');
const caretUpLocation = document.querySelector('[data-caret-up-location]');
const locationForm = document.querySelector('[data-location-form]');

passwordDropdownBtn.addEventListener('click', () => {
	if (passwordForm.classList.contains('active')) {
		caretUpPassword.style.display = 'none';
		caretDownPassword.style.display = 'inline';
	} else {
		caretUpPassword.style.display = 'inline';
		caretDownPassword.style.display = 'none';
	}
	passwordForm.classList.toggle('active');
});

locationDropdownBtn.addEventListener('click', () => {
	if (locationForm.classList.contains('active')) {
		caretUpLocation.style.display = 'none';
		caretDownLocation.style.display = 'inline';
	} else {
		caretUpLocation.style.display = 'inline';
		caretDownLocation.style.display = 'none';
	}
	locationForm.classList.toggle('active');
});

const closeAlertButton = document.querySelector('[data-close-alert-btn]');
const closeAlertDiv = document.querySelector('[data-close-alert-div]');
if (closeAlertDiv) {
	closeAlertDiv.addEventListener('mouseenter', () => {
		closeAlertButton.style.display = 'inline-block';
	});
	closeAlertDiv.addEventListener('mouseleave', () => {
		closeAlertButton.style.display = 'none';
	});
	closeAlertButton.addEventListener('click', () => {
		closeAlertDiv.style.display = 'none';
	});
}
