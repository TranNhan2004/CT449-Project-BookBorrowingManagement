const publisherController = require('../../controllers/book.data/publisher.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(publisherController.findAll)
    .post(publisherController.create)
    .delete(publisherController.deleteAll);


router.route('/:publisherId')
    .get(publisherController.findById)
    .patch(publisherController.updateBasicInfoById)
    .delete(publisherController.deleteById);

module.exports = router;