const Cart = require('./../models/cartModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.setUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.setCartId = catchAsync(async (req, res, next) => {
  const userCart = await Cart.findOne({ user: req.body.user });

  req.params.id = userCart._id;

  next();
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { products } = req.body; // Extrai o array de produtos da requisição
  const userId = req.body.user; // Supondo que o ID do usuário vem da autenticação

  // Verifica se o array de produtos foi fornecido e não está vazio
  if (!products || !Array.isArray(products) || products.length === 0) {
    return next(
      new AppError(
        'O array de produtos é obrigatório e não pode estar vazio.',
        400
      )
    );
  }

  // Verifica se o usuário já possui um carrinho
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // Cria um novo carrinho se não existir
    cart = await Cart.create({ user: userId, products: [] });
  }

  // Itera sobre os produtos enviados na requisição
  products.forEach(({ product, quantity }) => {
    const productIndex = cart.products.findIndex(
      item => item.product.toString() === product
    );

    if (productIndex > -1) {
      // Se o produto já estiver no carrinho, atualiza a quantidade
      cart.products[productIndex].quantity += quantity;
    } else {
      // Se não estiver, adiciona o produto ao carrinho
      cart.products.push({ product, quantity });
    }
  });

  // Popula os produtos no carrinho para calcular o preço total
  await cart.populate('products.product').execPopulate();

  // Calcula o preço total com duas casas decimais
  const totalPrice = cart.products.reduce((total, item) => {
    const productPrice =
      item.product.priceDiscount > 0
        ? item.product.priceDiscount
        : item.product.price;
    return total + productPrice * item.quantity;
  }, 0);

  cart.totalPrice = parseFloat(totalPrice.toFixed(2)); // Formata para duas casas decimais

  // Salva o carrinho atualizado
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: { cart }
  });
});

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
  const { cartId, productId } = req.params;

  // Busca o carrinho pelo ID e popula os produtos
  const cart = await Cart.findById(cartId).populate('products.product');
  if (!cart) {
    return next(new AppError('Carrinho não encontrado', 404));
  }

  // Verifica se o produto existe no carrinho
  const productIndex = cart.products.findIndex(
    item => item.product._id.toString() === productId
  );

  if (productIndex === -1) {
    return next(new AppError('Produto não encontrado no carrinho', 404));
  }

  // Remove o produto do array
  cart.products.splice(productIndex, 1);

  // Recalcula o preço total
  cart.totalPrice = cart.products.reduce((total, item) => {
    const productPrice =
      item.product.priceDiscount > 0
        ? item.product.priceDiscount
        : item.product.price;
    return total + productPrice * item.quantity;
  }, 0);

  // Salva o carrinho atualizado
  await cart.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({
      status: 'error',
      message: 'Por favor, envie o productId e a quantidade.'
    });
  }

  const cart = await Cart.findOne({ user: req.body.user });

  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrinho não encontrado para o usuário.'
    });
  }

  const productInCart = cart.products.find(item =>
    item.product._id.equals(productId)
  );

  if (!productInCart) {
    return res.status(400).json({
      status: 'error',
      message: 'Produto não encontrado no carrinho.'
    });
  }

  productInCart.quantity = quantity;

  // Atualiza o totalPrice do carrinho
  cart.totalPrice = cart.products.reduce((total, item) => {
    const productPrice =
      item.product.priceDiscount > 0
        ? item.product.priceDiscount
        : item.product.price;
    return total + productPrice * item.quantity;
  }, 0);

  // Salve o carrinho atualizado
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Quantidade atualizada com sucesso!',
    cart
  });
});

exports.getAllCarts = factory.getAll(Cart);
exports.getCart = factory.getOne(Cart);
exports.deleteCart = factory.deleteOne(Cart);
