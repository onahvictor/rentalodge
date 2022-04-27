const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtual: true } };

const lodgeSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);

lodgeSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/lodges/${this.id}">${this.title}</a><strong><p> ${this.description.substring(0, 20)}...</p>`
});


lodgeSchema.post('findOneAndDelete', async function (lodge) {
    if (lodge) {
        await Review.deleteMany({ id: { $in: lodge.reviews } });

    }

});
module.exports = mongoose.model('Lodge', lodgeSchema);