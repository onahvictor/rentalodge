const express = require("express");
const router = express.Router();
const lodges = require('../controllers/lodges');
const wrapAsync = require("../utilities/wrapAsync");
const { isLoggedIn, validateLodge, isAuthor } = require('../middleware'); 
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(lodges.index))
    .post(
        isLoggedIn,
        upload.array('image'),        
        validateLodge,        
        wrapAsync(lodges.create));

router.get(
    '/new',
    isLoggedIn,
    lodges.newForm);

router.route('/:id')
    .get(wrapAsync(lodges.showLodge))

    .put(
        isLoggedIn,
        isAuthor,
        upload.array('image'),
        validateLodge,
        wrapAsync(lodges.update))

    .delete(
        isLoggedIn,
        isAuthor,
        wrapAsync(lodges.delete));

router.get(
    '/:id/edit',
    isLoggedIn,
    isAuthor,
    wrapAsync(lodges.editForm));


module.exports = router; 