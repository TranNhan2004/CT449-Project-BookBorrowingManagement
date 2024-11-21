const authController = require('../../controllers/book.accounts/auth.controller');
const readerController = require('../../controllers/book.accounts/reader.controller');

const express = require('express');

const router = express.Router();
router.use(authController.protect);

router.route('/me').get(authController.restrictToReader(), readerController.getMe);
router.route('/me/update').patch(authController.restrictToReader(), readerController.updateMe);
router.route('/me/change-password').patch(authController.restrictToReader(), readerController.changeMyPassword);

router.route('/').get(readerController.findAll);
router.route('/:readerId').get(readerController.findById)

router.route('/:readerId').patch(authController.restrictToStaff(), readerController.updateBasicInfoById);
router.route('/validation/:readerId').patch(authController.restrictToStaff(), readerController.updateValidationById);

module.exports = router;