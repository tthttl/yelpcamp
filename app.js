const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    mongoose = require('mongoose'),
    User = require('./models/user'),
    seedDB = require('./seed');

const   campgroundRoutes    = require('./routes/campgrounds'),
        commentRoutes       = require('./routes/comments'),
        indexRoutes         = require('./routes/index');

const methodOverride = require('method-override');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

//DB SETUP => mongoose.connect() mongoose.Schema() mongoose.model()
mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware => makes user available automatically at all routes
app.use(function (req, res, next) {
    res.locals.user = req.user; //req.user is managed by Passport!!
    next();
});
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use(indexRoutes);

app.set('view engine', 'ejs');

app.listen(3000, () => console.log('Express UP'));




