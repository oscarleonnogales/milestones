if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');

const Post = require('./models/post');
const postRouter = require('./routes/posts');
const User = require('./models/user');
const userRouter = require('./routes/users');

import { checkNotAuthenticated } from './basicAuth';

// 3 Functions for passport
passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username: username }, async (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username' });
			}
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			}
			return done(null, false, { message: 'Incorrect password' });
		});
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

// Setting all dependencies
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json()); // Remove for production

mongoose.connect('mongodb://localhost/blogsite', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

// All routes

//homepage with all posts
app.get('/', async (req, res) => {
	const posts = await Post.find().sort({ createdAt: 'desc' }).populate('author');
	res.status(200);
	res.render('index', {
		user: req.user,
		posts: posts,
	});
});

//login page
app.get('/login', checkNotAuthenticated, (req, res) => {
	res.status(200);
	res.render('users/login', { user: new User(), error: null, message: null });
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
	})
);

app.delete('/logout', (req, res) => {
	req.logOut();
	res.status(200);
	res.redirect('/');
});

//signup page
app.get('/signup', checkNotAuthenticated, (req, res) => {
	res.status(200);
	res.render('users/signup', { user: new User(), error: null });
});

app.use('/posts', postRouter);
app.use('/users', userRouter);

app.listen(5000);
