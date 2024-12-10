const express = require('express');
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/order-customers').get(orderController.getAllOrders);

router
  .route('/purchase')
  .post(userController.setUserId, orderController.purchaseProduct);

router
  .route('/')
  .get(orderController.getCustomerData)
  .post(
    // authController.restrictTo('user'),
    userController.setUserId,
    orderController.createOrder
  );

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(authController.restrictTo('admin'), orderController.updateOrder)
  .delete(authController.restrictTo('admin'), orderController.deleteOrder);

module.exports = router;
