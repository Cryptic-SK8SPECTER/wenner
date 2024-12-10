const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'A quantidade deve ser pelo menos 1']
      }
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Supondo que há um modelo de usuário
    required: true
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

cartSchema.pre(/^find/, function(next) {
  // Popula os produtos no array 'products'
  this.populate({
    path: 'products.product', // Caminho correto
    select: 'name imageCover colors price priceDiscount' // Selecione os campos desejados
  });
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
