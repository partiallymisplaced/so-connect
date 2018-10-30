const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Includes Post, Profile models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Includes validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts
// @desc    Gets posts
// @access  Public

router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            noposts: "No posts were found"
        }));
})

// @route   GET api/posts/:id
// @desc    Gets a post by id
// @access  Public

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({
            noposts: "Post not found"
        }));
})

// @route   POST api/posts
// @desc    Creates a new post
// @access  Private

router.post(
    '/', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        });
        newPost.save()
            .then(post => res.json(post));
    }

)

// @route   DELETE api/posts/:id
// @desc    Deletes a post
// @access  Private

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.user.toString() !== req.user.id) {
                            return res.status(401).json({
                                unauthorized: "Unauthorized"
                            })
                        }
                        post.remove()
                            .then(() => res.json({
                                success: true
                            }))
                            .catch(err => res.status(404).json({
                                notfound: "This post does not exist"
                            }))
                    })
            })
    }
)

// @route   POST api/posts/like/:id
// @desc    Adds a like to post
// @access  Private

router.post(
    '/like/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                            return res.status(400).json({
                                postliked: "User already liked this post" 
                            })
                        }
                        post.likes.unshift({ user: req.user.id });
                        post.save().then(post => res.json(post));
                    })
                    .catch(err => res.status(404).json({
                        notfound: "Post could not be found"
                    }))
            })
    }
)

// @route   POST api/posts/unlike/:id
// @desc    Removes a like from post
// @access  Private

router.post(
    '/unlike/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                            return res.status(400).json({
                                notliked: "The user has not liked this post yet"
                            })
                        }
                        const removeIndex = post.likes
                            .map(item => item.user.toString())
                            .indexOf(req.user.id);
                        
                        post.likes.splice(removeIndex, 1);
                        post.save()
                            .then(post => res.json(post));
                    })
                    .catch(err => res.status(404).json({
                        notfound: "Post not found"
                    }))
            })

    }
)

// @route   POST api/posts/comment/:id
// @desc    Adds comment to a post
// @access  Private

router.post(
    '/comment/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput.req.body;

        if(!isValid) {
            return res.status(400).json(errors);
        }

        Post.findById(req.params.id) 
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.body.user.id
                }
                post.comments.unshif(newComment);
                post.save()
                    .then(post => res.json(post));
            })
            .catch(err => res.status(404).json({
                notfound: "Post not found"
            }))
    }
)

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Deletes comment from profile
// @access  Private

router.delete(
    '/comment/:id/:comment_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Post.findById(req.params.id)
            .then(post => {
                if (post.comments
                    .filter(comment => comment._id.toString() === req.params.comment_id)
                    .length === 0
                    ) {
                        return res.status(404).json({
                            notfound: "This comment does not exist"
                        })
                }
                const removeIndex = post.comments
                    .map(item => item._id.toString())
                    .indexOf(req.params.comment_id);

                post.comments.splice(removeIndex, 1);
                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404).json({ 
                notfound: "Post not found"
            }))
    }
)

module.exports = router;