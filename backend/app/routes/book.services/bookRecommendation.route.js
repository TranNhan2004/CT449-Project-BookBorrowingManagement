const bookRecommendationController = require('../../controllers/book.services/bookRecommendation.controller');

const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/')
    .get(bookRecommendationController.findAll)
    .post(upload.single('file'), bookRecommendationController.create)
    .delete(bookRecommendationController.deleteAll);


router.route('/:bookRecommendationId')
    .get(bookRecommendationController.findById)
    .delete(bookRecommendationController.deleteById);

router.route('/status/:bookRecommendationId').patch(bookRecommendationController.updateStatusById);

module.exports = router;