const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInputData(data) {
    let errors = {};
    
    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.school)) {
        errors.school = "Please include your school"
    }
    if (Validator.isEmpty(data.degree)) {
        errors.degree = "Please include your degree"
    }
    if (Validator.isEmpty(data.fieldOfStudy)) {
        errors.fieldOfStudy = "Please include your field of study"
    }
    if (Validator.isEmpty(data.from)) {
        errors.from = "Please include a starting date"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};