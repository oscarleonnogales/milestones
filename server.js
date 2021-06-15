if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const bcrypt = require('bcrypt');
const User = require('./models/user');

const indexRouter = require('./routes/index');
const postRouter = require('./routes/posts');
const userRouter = require('./routes/users');
const commmentsRouter = require('./routes/comments');
const settingsRouter = require('./routes/settings');

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

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
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
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to database'));

app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/comments', commmentsRouter);
app.use('/settings', settingsRouter);
app.use('/', indexRouter);

app.listen(process.env.PORT || 5000);
