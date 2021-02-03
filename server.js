const express = require('express');
const app = express();
const articleRouter = require('./routes/articles');

//article router

app.set('view engine', 'ejs');
app.use('/articles', articleRouter);

app.get('/', (req, res) => {
	const articles = [
		{
			title: 'Title for article',
			createdAt: Date.now(),
			description: 'test description',
		},
	];
	res.render('index', {
		articles: articles,
	});
});

app.listen(5000);
