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
