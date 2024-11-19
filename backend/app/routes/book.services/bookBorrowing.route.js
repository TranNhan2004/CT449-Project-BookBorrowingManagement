const authController = require('../../controllers/book.accounts/auth.controller');
const bookBorrowingController = require('../../controllers/book.services/bookBorrowing.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(bookBorrowingController.findAll)
    .post(authController.restrictToStaff(), bookBorrowingController.create)

router.route('/:bookBorrowingId')
    .get(bookBorrowingController.findById)
    .delete(authController.restrictToStaff(['admin']), bookBorrowingController.deleteById);


router.route('/return/:bookBorrowingId').patch(authController.restrictToStaff(), 
                                                bookBorrowingController.returnBookItemById);

router.route('/extend-due-date/:bookBorrowingId').patch(authController.restrictToReader(), 
                                                            bookBorrowingController.extendDueDateById);

module.exports = router;