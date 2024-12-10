const express = require('express');
const cartController = require('./../controllers/cartController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/cartId/:cartId/products/:productId')
  .delete(cartController.removeProductFromCart);

router
  .route('/add-to-cart')
  .post(cartController.setUserId, cartController.addToCart);

router
  .route('/update')
  .patch(cartController.setUserId, cartController.updateCart);

router
  .route('/')
  .get(
    cartController.setUserId,
    cartController.setCartId,
    cartController.getCart
  )
  .delete(cartController.deleteCart);

module.exports = router;
