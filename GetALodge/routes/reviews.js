const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews');
const wrapAsync = require("../utilities/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post(
    '/',
    isLoggedIn,
    validateReview,
    wrapAsync(reviews.create));

router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviews.delete));

module.exports = router;