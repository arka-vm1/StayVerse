const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params from parent router
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Reviews Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;