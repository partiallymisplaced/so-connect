const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

// Load profile and user models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Load validation for forms
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// @route   GET api/profile
// @desc    Gets current user profile
// @access  Private

router.get('/', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        let errors = {};
        Profile.findOne({user: req.user.id})
            .populate('user', ['name', 'avatar'])
            .then(profile => {
                if (!profile) {
                    errors.noprofile = "There is no profile for this user";
                    return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(400).json(err));
    }
);

// @route   POST api/profile
// @desc    Create or edit current user profile
// @access  Private

router.post('/', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateProfileInput(req.body);

        if(!isValid) {
            return res.status(400).json(errors);
        }
        // Get data form fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
        if (typeof req.body.skills !== 'undefined'){
            profileFields.skills = req.body.skills.split(',');
        }
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

        Profile.findOne({user: req.user.id})
            .then(profile => {
                // Update profile if it exists
                if(profile) {
                    Profile.findOneAndUpdate(
                        {user: req.user.id},
                        {$set: profileFields},
                        {new: true}
                    )
                    .then(profile => res.json(profile))
                    .catch(err => console.log(err))

                } else {
                    // Create profile if profile doesn't exist
                    Profile.findOne({handle: profileFields.handle})
                        .then(profile => {
                            if(profile){
                                errors.handle = "That handle already exists";
                                return res.status(400).json(errors);
                            }
                        })
                        .catch(err => console.log(err))

                        new Profile(profileFields)
                            .save()
                            .then(profile => res.json(profile))
                            .catch(err => console.log(err))

                }
            });
    }
)

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public

router.get('/all', (req, res) => {
    const errors = {};

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = "There are no profiles";
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({profile: "There are no profiles"}));
})

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There is no profile";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user_id
// @access  Public

router.get('/user/:user_id', (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There is no profile";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private

router.post(
    '/experience', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateExperienceInput(req.body);

        if(!isValid) {
            return res.status(400).json(errors);
        }

        Profile.findOne({user: req.user.id})
            .then(profile => {
                if (!profile) {
                    throw err;
                }
                const newExperience = {
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                };

                // Adds experience to the beginning array
                profile.experience.unshift(newExperience);
                profile.save()
                    .then(profile => res.json(profile))
                    .catch(err => console.log(err));
            })
    }
)

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private

router.post(
    '/education',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateEducationInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        Profile.findOne({ user: req.user.id }).then(profile => {
            const newEducation = {
                school: req.body.school,
                degree: req.body.degree,
                fieldOfStudy: req.body.fieldOfStudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            profile.education.unshift(newEducation);
            profile.save()
                .then(profile => res.json(profile));
        })
    }
)

// @route   DELETE api/profile/experience/:experience_id
// @desc    Delete experience from profile
// @access  Private

router.delete(
    '/experience/:experience_id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        let errors = {};
        Profile.findOne({user: req.user.id})
            .then(profile => {
                if(!profile) {
                    throw err;
                }
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexOf(req.params.experience_id);
                
                if(removeIndex === -1) {
                    errors.experiencenotfound = "Experience is not found";
                    return res.status(404).json(errors);
                }
                profile.experience.splice(removeIndex, 1);
                profile.save()
                    .then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    }
)

// @route   DELETE api/profile/education/:education_id
// @desc    Deletes experience from profile
// @access  Private

router.delete(
    '/education/:education_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                const removeIndex = profile.education.splice(removeIndex, 1);
                profile.save()
                    .then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    }
)

// @route   DELETE api/profile
// @desc    Deletes profile
// @access  Private

router.delete(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOneAndRemove({ user: req.user.id })
            .then(() => {
                User.findOneAndRemove({ _id: req.user.id })
                    .then(() => 
                        res.json({success: true})
                        )
            })
    }
)

module.exports = router;