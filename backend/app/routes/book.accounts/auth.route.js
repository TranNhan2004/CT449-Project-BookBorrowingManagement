const authController = require('../../controllers/book.accounts/auth.controller');

const express = require('express');
const router = express.Router();

router.route('/validate').get(authController.validate);
router.route('/staff-signup').post(authController.signup('staff'));
router.route('/reader-signup').post(authController.signup('reader'));
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);


module.exports = router;