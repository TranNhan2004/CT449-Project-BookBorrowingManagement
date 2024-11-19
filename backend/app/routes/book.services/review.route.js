
const authController = require('../../controllers/book.accounts/auth.controller');
const reviewController = require('../../controllers/book.services/review.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(reviewController.findAll)
    .post(authController.restrictToReader(), reviewController.create)
    .delete(reviewController.deleteAll);

router.route('/:reviewId')
    .get(reviewController.findById)
    .patch(authController.restrictToReader(), reviewController.updateRatingAndCommentById)
    .delete(reviewController.deleteById);

module.exports = router;