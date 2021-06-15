# Project Sharing Site

First attempt at a full stack application with my own backend.

Milestones is a forum site where new developers can share their completed projects with other developers. You don't need an account to view all the posts and comments, but once signed up you'll be able to post your own projects, like posts, comment on all posts, follow other users, and enable dark mode.

[Live Demo](https://milestones-site.herokuapp.com/) :point_left:

## Built with

- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/en/)
- [EJS](https://ejs.co/)

See the package.json file for a full list of dependencies.

## Authentication

Passwords are encrypted with [bcrypt](https://www.npmjs.com/package/bcrypt) before being stored on the database. Authorization is done through [Passport](http://www.passportjs.org/)'s local method.
