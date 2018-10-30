const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInputData(data) {
    let errors = {};
    
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = "Please include your job title"
    }
    if (Validator.isEmpty(data.company)) {
        errors.company = "Please include the name of your company"
    }
    if (Validator.isEmpty(data.from)) {
        errors.from = "Please include a starting date"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
