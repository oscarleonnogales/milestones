// Custom middleware
export function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) return next();
	else {
		res.status(401);
		res.redirect('/login');
	}
}

export function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) return res.redirect('/');
	next();
}

// Verifying permission
export function authUser(currentUser, post) {
	return currentUser.id == post.author || currentUser.role === 'admin';
}

export function renderEditDeleteButtons(currentUser, post) {
	if (currentUser == undefined) return false;
	else return currentUser.id == post.author.id || currentUser.role === 'admin';
}

export function logger() {
	console.log('logging');
}
