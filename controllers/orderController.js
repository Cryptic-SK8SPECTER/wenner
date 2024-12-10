const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const Product = require('../models/productModel');

exports.createOrder = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.body.user }).populate({
    path: 'products.product',
    select: 'price name stockQuantity' // Incluí o campo 'stockQuantity'
  });

  if (!cart || cart.products.length === 0) {
    return next(new AppError('Seu carrinho está vazio!', 400));
  }

  const orderProducts = cart.products.map(item => ({
    product: item.product._id,
    quantity: item.quantity,
    priceAtPurchase: item.product.price
  }));

  const totalPrice = orderProducts.reduce(
    (acc, item) => acc + item.quantity * item.priceAtPurchase,
    0
  );

  // Atualização do estoque
  for (const item of cart.products) {
    const product = item.product;

    // Verifica se há estoque suficiente
    if (product.stockQuantity < item.quantity) {
      return next(
        new AppError(
          `Estoque insuficiente para o produto: ${product.name}. Estoque disponível: ${product.stockQuantity}`,
          400
        )
      );
    }

    // Atualiza a quantidade no estoque
    await Product.findByIdAndUpdate(product._id, {
      $inc: { stockQuantity: -item.quantity }
    });
  }

  const order = await Order.create({
    user: req.user.id,
    products: orderProducts,
    totalPrice
  });

  // Limpa o carrinho após a encomenda ser concluída
  await Cart.findByIdAndDelete(cart._id);

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

exports.getCustomerData = catchAsync(async (req, res, next) => {
  const customers = await User.aggregate([
    {
      $match: {
        role: 'user' // Filtrar apenas usuários com role "user"
      }
    },
    {
      $lookup: {
        from: 'orders', // Nome da coleção de pedidos
        localField: '_id',
        foreignField: 'user',
        as: 'orders'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        contact: 1,
        status: { $cond: [{ $eq: ['$active', true] }, 'Ativo', 'Inativo'] }, // Status baseado no campo active
        ordersCount: { $size: '$orders' }, // Contar pedidos associados
        totalSpent: {
          $sum: {
            $map: {
              input: '$orders',
              as: 'order',
              in: '$$order.totalPrice' // Somar totalPrice de cada pedido
            }
          }
        }
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      customers
    }
  });
});

exports.purchaseProduct = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // Verifique a quantidade do produto em estoque
  const product = await Product.findById(productId);

  if (!product || product.stockQuantity < quantity)
    return new AppError('Estoque insuficiente', 400);

  // Calcular o preço total
  const totalPrice = product.price * quantity;

  // Criar um pedido com o produto e detalhes
  const order = await Order.create({
    user: req.user._id,
    products: [
      {
        product: productId,
        quantity,
        priceAtPurchase: product.price // Preço do produto no momento da compra
      }
    ],
    totalPrice
  });
  // Atualize o estoque do produto
  product.stockQuantity -= quantity;
  await product.save();

  res.status(200).json({ message: 'Compra realizada com sucesso!', order });
});

exports.getAllOrders = factory.getAll(Order);
exports.getOrder = factory.getOne(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
