const readerController = require('../../controllers/book.accounts/reader.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(readerController.findAll)
    .post(readerController.create)
    .delete(readerController.deleteAll);


router.route('/:readerId')
    .get(readerController.findById)
    .patch(readerController.updateBasicInfoById)
    .delete(readerController.deleteById);

router.route('/phone/:readerId').patch(readerController.updatePhoneNumberById);

router.route('/email/:readerId').patch(readerController.updateEmailById);

router.route('/password/:readerId').patch(readerController.updatePasswordById);

router.route('/point/:readerId').patch(readerController.updatePointById);

router.route('/validation/:readerId').patch(readerController.updateValiationById);

module.exports = router;