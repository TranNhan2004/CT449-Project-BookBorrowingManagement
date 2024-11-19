const authController = require('../../controllers/book.accounts/auth.controller');
const readerController = require('../../controllers/book.accounts/reader.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(authController.restrictToStaff(['admin', 'librarian']), readerController.findAll)

router.route('/:readerId')
    .get(authController.restrictToReader, readerController.findById)
    .patch(authController.restrictToReader, readerController.updateBasicInfoById)

router.route('/password/:readerId').patch(authController.restrictToReader, readerController.updatePasswordById);

module.exports = router;