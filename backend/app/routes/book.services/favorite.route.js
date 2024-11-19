const authController = require('../../controllers/book.accounts/auth.controller');
const favoriteController = require('../../controllers/book.services/favorite.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(favoriteController.findAll)
    .post(authController.restrictToReader(), favoriteController.create)
    .delete(favoriteController.deleteAll);


router.route('/:favoriteId')
    .get(favoriteController.findById)
    .delete(favoriteController.deleteById);

module.exports = router;