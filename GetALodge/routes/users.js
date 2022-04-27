const express = require('express');
const router = express.Router();
const passport = require('passport');

const { validateUser } = require('../middleware');
const wrapAsync = require('../utilities/wrapAsync');
const users = require('../controllers/users');

router.route('/register')
    .get(users.registerForm)
    .post(
        validateUser,
        wrapAsync(users.register));

router.route('/login')
    .get(users.loginForm)
    .post(
        passport.authenticate(
            'local',
            {
                failureFlash: true,
                failureRedirect: '/login'
            }),
        users.login);

router.get('/logout', users.logout);


module.exports = router;