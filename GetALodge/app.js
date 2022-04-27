if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require('express-mongo-sanitize');
const User = require('./models/user');
const AppError = require("./utilities/AppError");

const userRoutes = require('./routes/users');
const lodgeRoutes = require("./routes/lodges");
const reviewRoutes = require("./routes/reviews");
const dbUrl = 'mongodb://localhost:27017/getalodge';
const MongoStore = require("connect-mongo");


//connect to our database
mongoose.connect(dbUrl)
    // mongoose.connect(dbUrl)
    .then(() => {
        console.log("Database connected");
    }).catch(() => {
        console.log('Connection Error');
    });

//set up our express application    
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs'); //set up ejs for templating
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({ replaceWith: '_' }));


const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        ttl: 24 * 60 * 60
    }),
    name: 'ral_id',
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
};

app.use(session(sessionConfig));
app.use(flash());

//configuration for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//configuring my flash messages using re.locals variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//Set up routes
app.use('/', userRoutes);
app.use('/lodges', lodgeRoutes);
app.use('/lodges/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res) => {
    throw new AppError("Page Not Found", 404);
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No Something Went Wrong";
    res.status(statusCode).render('error', { err });
});

app.listen(8080, () => {
    console.log("Server is running at port 8080");
});

