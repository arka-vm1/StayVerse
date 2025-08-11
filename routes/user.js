const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectURL } = require("../middleware.js");
const userController = require("../controllers/user.js");

// Render Signup Form and Authenticate (Signup) Route
router.route("/signup").get(userController.renderSignupForm).post(wrapAsync(userController.signup));

// Render Login Form and Authenticate (Login) Route
router.route("/login").get(userController.renderLoginForm).post(saveRedirectURL, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), wrapAsync(userController.login));

// Logout Route
router.get("/logout", userController.logout);

module.exports = router;