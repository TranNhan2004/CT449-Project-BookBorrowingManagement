const reviewController = require('../../controllers/book.services/review.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(reviewController.findAll)
    .post(reviewController.create)
    .delete(reviewController.deleteAll);


router.route('/:reviewId')
    .get(reviewController.findById)
    .patch(reviewController.updateRatingAndCommentById)
    .delete(reviewController.deleteById);

module.exports = router;