const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle: '';
    data.status = !isEmpty(data.status) ? data.status: '';
    data.skills = !isEmpty(data.skills) ? data.skills: '';

    if (!Validator.isLength(data.handle, {min: 2, max: 40})) {
        errors.handle = "User handle can be between 2 and 40 characters";
    }
    if (Validator.isEmpty(data.handle)) {
        errors.handle = "User handle is required";
    }
    if (!Validator.isEmpty(data.status)) {
        errors.status = "Please specify your status";
    }
    if (!Validator.isEmpty(data.skills)) {
        errors.skills = "Please enter your skills";
    }
    if (!isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website = "Please enter a valid URL"
        }
    }
    if (!isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = "Please enter a valid URL"
        }
    }
    if (!isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = "Please enter a valid URL"
        }
    }
    if (!isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = "Please enter a valid URL"
        }
    }
    if (!isEmpty(data.linkedin)) {
        if (!Validator.isURL(data.linkedin)) {
            errors.linkedin = "Please enter a valid URL"
        }
    }
    if (!isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = "Please enter a valid URL"
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};