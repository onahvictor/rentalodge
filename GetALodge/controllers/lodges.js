const Lodge = require('../models/lodge');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const lodges = await Lodge.find({});
    res.render('lodge/index', { lodges });
};

module.exports.newForm = (req, res) => {
    res.render('lodge/new');
};

module.exports.create = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    const lodge = new Lodge(req.body);
    lodge.geometry = geoData.body.features[0].geometry;
    console.log(req.files)
    lodge.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    lodge.author = req.user.id;
    await lodge.save();
    // console.log(lodge)
    req.flash('success', 'Successfully made a new lodge');
    res.redirect(`lodges/${lodge.id}`);
};

module.exports.showLodge = async (req, res) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!lodge) {
        req.flash('error', 'Cannot Find that Lodge');
        return res.redirect('/lodges');
    }
    res.render('lodge/show', { lodge });
};

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id);
    if (!lodge) {
        req.flash('error', 'Cannot Find that Lodge');
        return res.redirect('/lodges');
    }
    res.render('lodge/edit', { lodge });
};

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    const lodge = await Lodge.findByIdAndUpdate(id, { ...req.body }, { runValidators: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    lodge.images.push(...imgs);
    lodge.geometry = geoData.body.features[0].geometry;
    await lodge.save();
    // console.log(req.body.deleteImages);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await lodge.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        // Pulling an element out of the images array where the filename is in the req.body.deleteImages
        // pull from the images array all images where the filename of that image is in the request.body.deleteImages array
    }
    req.flash('success', 'Lodge info Successfully updated');
    res.redirect(`/lodges/${lodge.id}`);
};

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Lodge.findByIdAndDelete(id);
    req.flash('success', 'Lodge is Successfully Deleted');
    res.redirect('/lodges');
};