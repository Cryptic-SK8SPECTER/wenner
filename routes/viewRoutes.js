const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get(
  '/acessorio/:slug',
  authController.isLoggedIn,
  viewsController.getProductDetail
);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);
router.get('/forgot', authController.isLoggedIn, viewsController.getForgotForm);
router.get(
  '/reset/:token',
  authController.isLoggedIn,
  viewsController.getResetPasswordForm
);
// router.get('/me', authController.protect, viewsController.getAccount);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/order-list', authController.protect, viewsController.getOrderList);
router.get('/order/:id', authController.protect, viewsController.order);
router.get(
  '/customer-list',
  authController.protect,
  viewsController.getCustomerList
);
router.get(
  '/product-list',
  authController.protect,
  viewsController.getProductList
);
router.get(
  '/product-add',
  authController.protect,
  viewsController.getProductAdd
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);
router.get('/checkout', authController.protect, viewsController.checkout);

module.exports = router;
