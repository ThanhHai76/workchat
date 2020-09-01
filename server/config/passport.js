const passport = require('passport');
const facebookTokenStrategy = require('passport-facebook-token');
const googleTokenStrategy = require('passport-google-token');
const User = require('../models/users');


module.exports = function () {
    passport.use('facebookToken', new facebookTokenStrategy({
        clientID: process.env.FACEBOOK_APP_ID || '1360703950756235',//2965647346823367
        clientSecret: process.env.FACEBOOK_APP_SECRET || 'ba41d43da7155b1792948a95a1918bb4'//eb680be7925f76e8cd9aec2118ac9bc5
    }, (accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile);
            User.findOne({ social_id: profile.id }, function (err, user) {
                if (err) done(err, false);
                if (user) {
                    done(null, user);
                } else {
                    const newUser = {
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        social_id: profile.id,
                        social_provider: profile.provider,
                    }
                    User.create(newUser, function (err, user) {
                        if (err) done(null, false);
                        if (user) {
                            done(null, user);
                        } else {
                            done(null, false);
                        }
                    });
                }
            });
        } catch (error) {
            done(error, false);
        }
    }));

    passport.use('googleToken', new googleTokenStrategy.Strategy({
        clientID: process.env.GOOGLE_APP_ID || '159957289052-k9qaa2dp92avv931ae5vuo9va7upfelp.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_APP_SECRET || 'v10aTn2VLy57wX_z0ypXcB-I'
    }, (accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile);
            User.findOne({ social_id: profile.id }, function (err, user) {
                if (err) done(err, false);
                if (user) {
                    done(null, user);
                } else {
                    const newUser = {
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile._json.picture,
                        social_id: profile.id,
                        social_provider: profile.provider,
                    }
                    Users.create(newUser, function (err, user) {
                        if (err) done(null, false);
                        if (user) {
                            done(null, user);
                        } else {
                            done(null, false);
                        }
                    });
                }
            });
        } catch (error) {
            done(error, false);
        }
    }
    ));
};