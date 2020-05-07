const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('landing',);
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', function (req, res) {
    const user = new User({username: req.body.username});
    console.log(user);
    // save user with the password hashed
    User.register(user, req.body.password, function (err, savedUser) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        // compare saved hash with the body.password hash => if same => redirect
        passport.authenticate('local')(req, res, function () {
            res.redirect('/campgrounds');
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    })
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/campgrounds');
});

module.exports = router;
