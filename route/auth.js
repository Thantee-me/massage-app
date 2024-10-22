const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const AuthController = require('../api/authController');

router.post('/login', AuthController.login);
router.post('/authen', auth,AuthController.authen);

module.exports = router; 