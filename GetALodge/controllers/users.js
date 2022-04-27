const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        registeredUser = await User.register(newUser, password);;
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'welcome to GetALodge');
            res.redirect('/lodges');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/lodges'
    // console.log(req.session)
    delete req.session.returnTo
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/lodges');
}