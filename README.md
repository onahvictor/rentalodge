# RentAlodge

RentALodge is a website where users can create and review Student Lodges. In order to review or create a Lodge, you must have an account. This project was created using Node.js, Express, MongoDB, Bootstrap and Passport.js was used to handle authentication.

# Features

- Users can create, edit, and remove campgrounds
- Users can review Lodges once, and edit or remove their own review
- User profiles include more information on the user (full name, email, phone, join date), their Lodges, and the option to edit their profile or delete their account
- Search Lodges by name or location
- Sort Lodges by highest rating, most reviewed, lowest price, or highest price

# Run it locally

1. Install mongodb
2. Create a cloudinary account to get an API key and secret code

# Built With

- [Node.js](https://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [MongoDB](https://www.mongodb.com/)- The database for modern applications
- [Mongoose](https://mongoosejs.com/)- Elegant MongoDB object modelling for Node.js
- [ejs](https://ejs.co/) - Embedded JavaScript templating
- Create a .env file (or just export manually in the terminal) in the root of the project and add the following:\

```
DATABASEURL='<url>
API_KEY='<key>'
API_SECRET='<secret>
```

Run `mongod` in another terminal and `node app.js` in the terminal with the project.

Then go to localhost:3000.
