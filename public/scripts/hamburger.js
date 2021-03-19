const hamburgerBtn = document.querySelector('[data-hamburger-btn]');
const navOverlay = document.querySelector('[data-overlay]');
const navbar = document.querySelector('[data-vertical-navbar]');

hamburgerBtn.addEventListener('click', () => {
	navOverlay.classList.add('active');
	navbar.classList.add('active');
	hamburgerBtn.style.display = 'none';
});

navOverlay.addEventListener('click', () => {
	navOverlay.classList.remove('active');
	navbar.classList.remove('active');
	hamburgerBtn.style.display = 'block';
});
