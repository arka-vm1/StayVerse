// Environment Variables
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

// Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

// Routes
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');



// Configuration Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(flash());
app.engine('ejs', ejsMate);



// Database Configuration Function
let serverConnection = process.env.ATLASDB_URL; // Server Connection

async function main() {
    await mongoose.connect(serverConnection);
}
main().then((res) => console.log("Connected to DB")).catch(err => console.log(err));


// MongoDB Session Store Configuration
const mongoStore = MongoStore.create({
    mongoUrl: serverConnection, // This is used to connect to the database
    crypto: {
        secret: process.env.SECRET // This is used to encrypt the session which is passed inside of a crypto object
    },
    touchAfter: 24 * 60 * 60, // This is used to update the session every 24 hours
    
});
mongoStore.on('error', function (error) {
    console.log("MongoDB Session Store Error",error);
});

// Session Configuration Middleware
const sessionConfig = {
    store: mongoStore, // This is used to store the session in the database
    secret: process.env.SECRET, // This is used to encrypt the session
    resave: false, // This is used to save the session even if it is not modified
    saveUninitialized: true, // This is used to save the session even if it is not initialized
    cookie: {
        httpOnly: true, // This is used to prevent the cookie from being accessed by the client
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// Passport Configuration Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

// Server Status Route
app.get("/", (req, res) => {
    res.redirect('/listings');
})

// All Users Route (Authentication Route)
app.use("/", userRouter);

// All Listings Route
app.use("/listings", listingsRouter);

// All Reviews Route
// We are using mergeParams so that we can access the id of the listing
app.use("/listings/:id/reviews", reviewsRouter);

// 404 Route
app.all("*rest", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})




// Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
})

port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})