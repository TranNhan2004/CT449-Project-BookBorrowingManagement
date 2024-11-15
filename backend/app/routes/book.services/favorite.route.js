const favoriteController = require('../../controllers/book.services/favorite.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(favoriteController.findAll)
    .post(favoriteController.create)
    .delete(favoriteController.deleteAll);


router.route('/:favoriteId')
    .get(favoriteController.findById)
    .delete(favoriteController.deleteById);

module.exports = router;