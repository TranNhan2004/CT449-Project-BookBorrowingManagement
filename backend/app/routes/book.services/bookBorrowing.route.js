const bookBorrowingController = require('../../controllers/book.services/bookBorrowing.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(bookBorrowingController.findAll)
    .post(bookBorrowingController.create)
    .delete(bookBorrowingController.deleteAll);


router.route('/:bookBorrowingId')
    .get(bookBorrowingController.findById)
    .delete(bookBorrowingController.deleteById);

router.route('/return/:bookBorrowingId').patch(bookBorrowingController.returnBookItemById);
router.route('/extend-due-date/:bookBorrowingId').patch(bookBorrowingController.extendDueDateById);
router.route('/due-date/').patch(bookBorrowingController.checkDueDate);

module.exports = router;