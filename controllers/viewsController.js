const Product = require('../models/productModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Obter os produtos com estoque disponível (stockQuantity > 0)
  const products = await Product.find({ stockQuantity: { $gt: 0 } });

  // 2) Transformar a string `colors` de cada produto em um array
  const transformedProducts = products.map(product => ({
    ...product.toObject(), // Converte o documento Mongoose para um objeto JavaScript
    colors: product.colors ? product.colors.split(',') : [] // Divide em array ou vazio
  }));

  // 3) Renderizar a página com os produtos transformados
  res.status(200).render('overview', {
    title: 'Acessórios',
    products: transformedProducts // Envia os produtos com `colors` como array
  });
});

exports.getProductDetail = catchAsync(async (req, res, next) => {
  // 1) Buscar os dados do produto solicitado
  const product = await Product.findOne({ slug: req.params.slug });

  // Se o produto não for encontrado
  if (!product) {
    return next(
      new AppError('Não existe nenhum acessório com esse nome.', 404)
    );
  }

  // 2) Transformar o campo `colors` em um array
  const transformedProduct = {
    ...product.toObject(), // Converte o documento Mongoose para um objeto JavaScript
    colors: product.colors ? product.colors.split(',') : [] // Divide em array ou vazio
  };

  const relatedProductsRaw = await Product.find({
    category: product.category, // Mesma categoria
    _id: { $ne: product._id } // Excluir o produto atual
  }).limit(4); // Limite de itens relacionados (opcional)

  const relatedProducts = relatedProductsRaw.map(prod => ({
    ...prod.toObject(), // Converte para objeto JS
    colors: prod.colors ? prod.colors.split(',') : [] // Divide o campo `colors` em array
  }));

  // 4) Renderizar o template com os dados
  res.status(200).render('product-details', {
    title: `${product.name} acessório`,
    product: transformedProduct, // Envia o produto transformado
    relatedProducts // Envia os produtos relacionados
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Faça login em sua conta'
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('register', {
    title: 'Crie uma nova conta'
  });
};

exports.getForgotForm = (req, res) => {
  res.status(200).render('forgot-password', {
    title: 'Recuperar Senha'
  });
};

exports.getResetPasswordForm = (req, res) => {
  const { token } = req.params;
  res.status(200).render('reset-password', {
    title: 'Redefinir senha',
    token
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('profile', {
    title: 'Perfil'
  });
};

exports.getOrderList = catchAsync(async (req, res, next) => {
  const orders = await Order.aggregate([
    {
      $match: { status: 'pendente' } // Somente encomendas pendentes
    },
    {
      $lookup: {
        from: 'users', // Nome da coleção de usuários
        localField: 'user', // Campo no esquema de pedidos que se conecta ao usuário
        foreignField: '_id', // Campo no esquema de usuários que corresponde ao localField
        as: 'userDetails' // Nome do campo onde os dados do usuário serão armazenados
      }
    },
    {
      $unwind: '$userDetails' // Desestrutura o array `userDetails` para obter um objeto
    },
    {
      $project: {
        _id: 1,
        totalProducts: { $size: '$products' }, // Contagem de produtos na encomenda
        totalPrice: 1,
        createdAt: {
          $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } // Formatação direta no MongoDB
        },
        status: 1,
        user: {
          _id: '$userDetails._id',
          photo: '$userDetails.photo',
          name: '$userDetails.name',
          email: '$userDetails.email',
          contact: '$userDetails.contact',
          address: '$userDetails.address'
        },
        products: 1 // Produtos na encomenda
      }
    }
  ]);

  res.status(200).render('order-list', {
    title: 'Encomendas',
    orders
  });
});

exports.getProductList = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render('product-list', {
    title: 'Lista de Acessorios',
    products
  });
});

exports.getProductAdd = (req, res) => {
  res.status(200).render('product-add', {
    title: 'Adicionar Acessorio'
  });
};

exports.getCustomerList = catchAsync(async (req, res, next) => {
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
        photo: 1,
        name: 1,
        email: 1,
        contact: 1,
        address: 1,
        birthDate: 1,
        active: 1,
        startDate: 1,
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

  res.status(200).render('customer-list', {
    title: 'Lista de clientes',
    customers
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Sua conta',
    user: updatedUser
  });
});

exports.checkout = catchAsync(async (req, res, next) => {
  const userCart = await Cart.findOne({ user: req.user.id });

  res.status(200).render('checkout', {
    title: 'Checkout',
    userCart: userCart || { products: [] }
  });
});

exports.order = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;
  const orderdetails = await Order.findById(orderId)
    .populate('products.product') // Preenche os detalhes do produto
    .populate('user'); // Preenche os detalhes do usuário

  if (!orderdetails) {
    return next(new AppError('Encomenda não encontrada', 404));
  }

  console.log('Order details:', orderdetails);

  const formattedDate = orderdetails.createdAt.toLocaleDateString('pt-PT');

  // Passar os dados da encomenda para a view
  res.status(200).render('order', {
    title: 'Encomenda',
    order: orderdetails,
    formattedDate // Passa os dados da encomenda para a view
  });
});
