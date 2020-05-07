const express = require('express');
const router = express.Router();
const CampGround = require('../models/campground');

router.get('/', (req, res) => {
    CampGround.find({}, function (error, result) {
        if (error) {
            console.log(error.message);
        } else {
            res.render('campground/campgrounds', {campgrounds: result});
        }
    });
});

router.post('/', isLoggedIn, (req, res) => {
    const campGroundToSave = {
        name: req.body.name,
        image: req.body.img,
        description: req.body.description,
        author: req.user
    };
    createNewCampGround(campGroundToSave);
    res.redirect('/campgrounds');
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campground/new');
});

router.get('/:id', (req, res) => {
    CampGround
        .findById(req.params.id)
        .populate('comments')
        .populate('author')
        .exec(function (error, result) {
            if (error) {
            } else {
                res.render('campground/show', {camp: result});
            }
        });
});

router.get('/:id/edit', isAuthorized, async (req, res) => {
    const foundCampground = await CampGround.findById(req.params.id);
    res.render('campground/edit', {camp: foundCampground});
});

router.put('/:id', isAuthorized, (req, res) => {
    const updatedCampground = {
        name: req.body.name,
        image: req.body.img,
        description: req.body.description
    };
    CampGround.findByIdAndUpdate(req.params.id, updatedCampground, (error, savedCampground) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/:id', isAuthorized, (req, res) => {
    CampGround.findByIdAndDelete(req.params.id, (error) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

function isLoggedIn(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function isAuthorized(req, res, next) {
    if (req.isAuthenticated()) {
        CampGround.findById(req.params.id)
            .populate('author')
            .exec((error, foundCampground) => {
                if (error) {
                    console.log(error);
                } else {
                    if (foundCampground.author._id.equals(req.user.id)) {
                        next();
                    } else {
                        console.log('Button should not be visible');
                        res.redirect('back');
                    }
                }
            });
    } else {
        res.redirect('/login');
    }
}

function createNewCampGround(campGroundToSave) {
    CampGround.create(campGroundToSave,
        function (error, campground) {
            if (error) {
                console.log(error.message);
            } else {
                console.log(campground);
            }
        });
}

module.exports = router;
