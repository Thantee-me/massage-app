const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const ShopController = require('../api/shopController');

//users
router.get('/users/get', ShopController.get);
router.post('/users/info', auth, ShopController.info);
router.post('/users/create', auth, ShopController.create);
router.put('/users/update', auth, ShopController.update);
router.delete('/users/delete', auth, ShopController.delete);

//Product
router.post('/products/create', auth, ShopController.products_create);
router.post('/products/update', auth, ShopController.products_update);

//staff
router.post('/staff/create', auth, ShopController.staff_create);
router.post('/staff/update', auth, ShopController.staff_update);
router.post('/staff/get', auth, ShopController.staff_get);

//message_menu
router.post('/message_menu/create', auth, ShopController.message_menu_create);  
router.post('/message_menu/update', auth, ShopController.message_menu_update);
router.post('/message_menu/get', auth, ShopController.message_menu_get);

//packages
router.post('/packages/create', auth, ShopController.packages_create);
router.post('/packages/update', auth, ShopController.packages_update);
router.post('/packages/info', auth, ShopController.packages_info);
router.post('/packages/get', auth, ShopController.packages_get);

//fields
router.post('/showfields', auth, ShopController.showfields);

//members
router.post('/members/create', auth, ShopController.members_create);
router.post('/members/update', auth, ShopController.members_update);
router.post('/members/info', auth, ShopController.members_info);
router.get('/members/get', ShopController.members_get);

// router.post('/payment_type/create', auth, ShopController.payment_type_create);
// router.post('/payment_type/update', auth, ShopController.payment_type_update);
// router.post('/payment_type/info', auth, ShopController.payment_type_info);
router.get('/payment_type/get', auth,ShopController.payment_type_get);

router.post('/staff_checkin/get', auth,ShopController.staff_checkin_get);

router.post('/job_massages/create', auth, ShopController.job_massages_create);
router.post('/job_massages/update', auth, ShopController.job_massages_update);
router.post('/job_massages/get_timeline', auth, ShopController.job_massages_get_timeline);
router.post('/job_massages/info', auth, ShopController.job_massages_info);
router.post('/job_massages/billing', auth, ShopController.job_massages_billing);

module.exports = router; 