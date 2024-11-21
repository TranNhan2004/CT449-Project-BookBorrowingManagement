const authController = require('../../controllers/book.accounts/auth.controller');
const topicController = require('../../controllers/book.data/topic.controller');

const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.route('/').get(topicController.findAll);
router.route('/:topicId').get(topicController.findById);

router.use(authController.restrictToStaff(['admin']));
router.route('/')
    .post(topicController.create)
    .delete(topicController.deleteAll);

router.route('/:topicId')
    .delete(topicController.deleteById);

module.exports = router;