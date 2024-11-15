const topicController = require('../../controllers/book.data/topic.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(topicController.findAll)
    .post(topicController.create)
    .delete(topicController.deleteAll);


router.route('/:topicId')
    .get(topicController.findById)
    .delete(topicController.deleteById);

module.exports = router;