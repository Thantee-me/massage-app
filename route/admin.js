const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const AdminController = require('../api/adminController');

router.get('/get', AdminController.getusers);

module.exports = router; 