const authorController = require('../../controllers/book.data/author.controller');

const express = require('express');
const router = express.Router();

router.route('/')
    .get(authorController.findAll)
    .post(authorController.create)
    .delete(authorController.deleteAll);


router.route('/:authorId')
    .get(authorController.findById)
    .patch(authorController.updateBasicInfoById)
    .delete(authorController.deleteById);

module.exports = router;