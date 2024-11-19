const authController = require('../../controllers/book.accounts/auth.controller');
const bookItemController = require('../../controllers/book.data/bookItem.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(bookItemController.findAll);

router.route('/:bookItemId')
    .get(bookItemController.findById);
    
router.use(authController.restrictToStaff(['admin']));
router.route('/')
    .post(bookItemController.create)
    .delete(bookItemController.deleteAll);

router.route('/:bookItemId')
    .delete(bookItemController.deleteById);


module.exports = router;