const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const User = require('./models/user');

const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const userRouter = require('./routes/users');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Remove for production

mongoose.connect('mongodb://localhost/blogsite', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

app.get('/', async (req, res) => {
	const articles = await Article.find().sort({ createdAt: 'desc' });
	res.render('articles/index', {
		articles: articles,
	});
});

app.get('/login', (req, res) => {
	res.render('users/login', { user: new User(), error: null });
});

app.get('/signup', (req, res) => {
	res.render('users/signup', { user: new User(), error: null });
});

app.use('/articles', articleRouter);
app.use('/users', userRouter);

app.listen(5000);
