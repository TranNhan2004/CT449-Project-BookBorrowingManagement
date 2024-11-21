const authController = require('../../controllers/book.accounts/auth.controller');
const publisherController = require('../../controllers/book.data/publisher.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.route('/').get(publisherController.findAll);
router.route('/:publisherId').get(publisherController.findById);

router.use(authController.restrictToStaff(['admin']));
router.route('/')
    .post(publisherController.create)
    .delete(publisherController.deleteAll);

router.route('/:publisherId')
    .patch(publisherController.updateBasicInfoById)
    .delete(publisherController.deleteById);

module.exports = router;