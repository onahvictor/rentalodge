const { userSchema, lodgeSchema, reviewSchema } = require('./schemas');
const AppError = require("./utilities/AppError");
const Lodge = require('./models/lodge');
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
};

//middleware that handles our camp validation data using Joi
module.exports.validateLodge = (req, res, next) => {
    const { error } = lodgeSchema.validate(req.body);
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id);
    if (!lodge.author.equals(req.user.id)) {
        req.flash('error', 'You don not have permission to do that');
        return res.redirect(`/lodges/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', 'You don not have permission to do that');
        return res.redirect(`/lodges/${id}`);
    }
    next();
};

//middleware that handles our Review validation data using Joi
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', msg);
        return res.redirect('/register');
    } else {
        next();
    }
};