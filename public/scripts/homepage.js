const posts = Array.from(document.querySelectorAll('.post-container'));
posts.forEach((post) => {
	post.addEventListener('click', (e) => {
		console.log(e);
	});
});
