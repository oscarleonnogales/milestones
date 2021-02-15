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
export function authUser(client, post) {
	return client.id == post.author || client.role === 'admin';
}

export function renderEditDeleteButtons(client, post) {
	if (client == undefined) return false;
	else return client.id == post.author.id || client.role === 'admin';
}
