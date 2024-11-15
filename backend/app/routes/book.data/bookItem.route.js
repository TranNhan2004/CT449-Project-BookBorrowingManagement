const bookItemController = require('../../controllers/book.data/bookItem.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(bookItemController.findAll)
    .post(bookItemController.create)
    .delete(bookItemController.deleteAll);


router.route('/:bookItemId')
    .get(bookItemController.findById)
    .delete(bookItemController.deleteById);

router.route('/status/:bookItemId').patch(bookItemController.updateStatusById);

module.exports = router;