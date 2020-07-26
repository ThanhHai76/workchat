const { check } = require('express-validator');

let validateRegisterUser = () => {
    return [
        check('user.name', 'name does not Empty').not().isEmpty(),
        check('user.name', 'name must be Alphanumeric').isAlphanumeric(),
        check('user.name', 'name more than 6 degits').isLength({ min: 6 }),
        check('user.email', 'Invalid does not Empty').not().isEmpty(),
        check('user.email', 'Invalid email').isEmail(),
        check('user.date_of_birth', 'Invalid birthday').isISO8601('mm/dd/yyyy'),
        check('user.password', 'password more than 6 degits').isLength({ min: 6 })
    ];
}

let validateLogin = () => {
    return [
        check('user.email', 'Invalid does not Empty').not().isEmpty(),
        check('user.email', 'Invalid email').isEmail(),
        check('user.password', 'password more than 6 degits').isLength({ min: 6 })
    ];
}

let validate = {
    validateRegisterUser: validateRegisterUser,
    validateLogin: validateLogin
};

module.exports = { validate };