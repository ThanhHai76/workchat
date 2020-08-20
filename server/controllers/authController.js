const Users = require('../models/users');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = function (req, res, next) {
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {

        const jwtToken = req.headers.authorization.split(' ')[1];
        jwt.verify(jwtToken, config.jwtSecret, function (err, payload) {
            if (err) {
                res.status(401).json({ message: 'Unauthorized user!' });
            } else {
                // find
                Users.findOne({
                    'email': payload.email,
                    'token': jwtToken
                }, function (err, user) {
                    if (user) {
                        req.user = user;
                        next();
                    } else {
                        res.status(401).json({ message: 'Unauthorized user!' });
                    }
                })
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized user!' });
    }
};