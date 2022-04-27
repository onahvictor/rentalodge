const Review = require('../models/review');
const Lodge = require('../models/lodge');

module.exports.create = async (req, res) => {
    const lodge = await Lodge.findById(req.params.id);
    const review = new Review(req.body);
    lodge.reviews.push(review);
    review.author = req.user.id;
    await review.save();
    await lodge.save();
    req.flash('success', 'Successfully made a new review');
    res.redirect(`/lodges/${lodge.id}`);
}

module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params;
    await Lodge.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Successfully Deleted');
    res.redirect(`/lodges/${id}`);
}