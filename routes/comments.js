const express = require('express');
const router = express.Router({mergeParams: true});
const CampGround = require('../models/campground');
const Comment = require('../models/comment');


router.get('/new', isLoggedIn, async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render('comment/new', {camp: campground});
});

router.post('/', isLoggedIn, async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const comment = {
        text: req.body.text,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Comment.create(comment, (error, savedComment) => {
        if (error) {
            console.log(error);
        } else {
            campground.comments.push(savedComment);
            campground.save();
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.get('/:comment_id/edit', isAuthorized, async (req, res) => {
    try {
        // would work, but not necessary
        /* const foundCampground = await CampGround.findById(req.params.id).populate('comments').exec();
         const comment = foundCampground.comments.find(item => item._id = req.params.comment_id);*/
        const comment = await Comment.findById(req.params.comment_id);
        res.render('comment/edit', {campId: req.params.id, comment: comment});
    } catch (e) {
        console.log(e);
        res.redirect('back');
    }
});

router.put('/:comment_id', isAuthorized, (req, res) => {
    const updatedComment = {
        text: req.body.text
    };
    // it is enough to update the comment (no need to push it again to camp.comments)
    Comment.findByIdAndUpdate(req.params.comment_id, updatedComment, (error, savedComment) => {
        if (error) {
            console.log(error);
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/:comment_id', isAuthorized, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (error) => {
        if (error) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

module.exports = router;

function isLoggedIn(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function isAuthorized(req, res, next) {
    if (req.isAuthenticated) {
        Comment.findById(req.params.comment_id, (error, foundComment) => {
            if (error) {
                console.log(error);
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user.id)) {
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


