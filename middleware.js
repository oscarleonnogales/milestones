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

export function getPaginatedResults(Model, searchParameters) {
	return async (req, res, next) => {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const paginatedResults = {};
		if (startIndex > 0) {
			paginatedResults.previous = {
				page: page - 1,
				limit,
			};
		}
		if (endIndex < (await Model.find(searchParameters).countDocuments().exec())) {
			paginatedResults.next = {
				page: page + 1,
				limit,
			};
		}
		try {
			paginatedResults.results = await Model.find(searchParameters)
				.sort({ createdAt: 'desc' })
				.populate('author')
				.limit(limit)
				.skip(startIndex)
				.exec();
			res.paginatedResults = paginatedResults;
			next();
		} catch (error) {
			res.status(500);
		}
	};
}
