const mongoose = require('mongoose');
const Lodge = require('../models/lodge');
const cities = require('./cities');
const { places, descriptors } = require('./seedshelper');

mongoose.connect('mongodb://localhost:27017/getalodge')
    .then(() => {
        console.log("Database connected");
    }).catch(() => {
        console.log('Connection Error');
    });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Lodge.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const lodge = new Lodge({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '6266d66162be65754450aa6b',
            // Your user Id for the database creation
            // image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In laudantium ab quidem corrupti praesentium minus consectetur architecto dolore, voluptas a distinctio voluptatibus pariatur at molestias accusamus temporibus. Ex, labore veniam!',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                // https://res.cloudinary.com/dxyl75uku/image/upload/v1650905415/GetALodge/New_Jersey_zjtss1.jpg
                {
                    url: 'https://res.cloudinary.com/dxyl75uku/image/upload/v1650905415/GetALodge/New_Jersey_zjtss1.jpg',
                    filename: 'GetALodge/New_Jersey_zjtss1.jpg'
                },
                // {
                //     url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/GetALodge/ruyoaxgf72nzpi4y6cdi.png',
                //     filename: 'GetALodge/ruyoaxgf72nzpi4y6cdi'
                // }
            ]
        });
        await lodge.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();

});

// Note for GeoJason we take longitude first and then latitude
