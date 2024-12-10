const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  slug: String,
  name: {
    type: String,
    required: [true, 'Por favor, forneça o nome do acessório!'],
    trim: true,
    maxlength: [100, 'O nome do acessório não pode exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Por favor, forneça uma descrição para o acessório'],
    maxlength: [500, 'A descrição não pode exceder 500 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'Por favor, forneça o preço do acessório'],
    min: [0, 'O preço não pode ser negativo']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // this only points to current doc on NEW document creation
        return val < this.price;
      },
      message:
        'O preço com desconto ({VALUE}) deve estar abaixo do preço normal'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'A classificação deve estar acima de 1,0'],
    max: [5, 'A classificação deve ser inferior a 5,0'],
    set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: [
      'eletrônicos',
      'vestuário',
      'alimentos',
      'Brinquedos',
      'livros',
      'outros'
    ],
    required: [true, 'Por favor, selecione a categoria do acessório']
  },
  gender: {
    type: String,
    enum: ['masculino', 'feminino', 'crianças', 'unissex'],
    required: [true, 'Por favor, selecione o gênero do acessório']
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Por favor, forneça a quantidade em estoque'],
    min: [0, 'A quantidade em estoque não pode ser negativa']
  },
  imageCover: {
    type: String,
    required: [true, 'Um acessório deve ter uma imagem de capa']
  },
  statusDiscount: {
    type: String,
    enum: ['não', 'sim'],
    required: [true, 'Um acessório deve ter status de disconto']
  },
  images: [String],
  sizes: [
    {
      type: String,
      required: [true, 'Por favor, forneça pelo menos um tamanho'],
      enum: [
        'PP',
        'P',
        'M',
        'G',
        'GG',
        'XG',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        'XXXL'
      ]
    }
  ],
  colors: {
    type: String, // Armazenado como uma única string
    validate: {
      validator: function(value) {
        return value.split(',').every(color => /^#[0-9A-Fa-f]{6}$/.test(color));
      },
      message:
        'Cada cor deve ser um código hexadecimal válido (#RRGGBB), separado por vírgulas.'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function(value) {
      return value
        ? `${value.getDate()}/${value.getMonth() + 1}/${value.getFullYear()}`
        : value;
    }
  },
  active: {
    type: Boolean,
    default: true
  }
});

productSchema.index({ slug: 1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Middleware para garantir que o preço sempre tenha duas casas decimais
productSchema.pre('save', function(next) {
  this.price = Number(this.price.toFixed(2));
  next();
});

// Método para verificar se o acessório está em estoque
productSchema.methods.isInStock = function(quantity) {
  return this.stockQuantity >= quantity;
};

productSchema.pre('save', function(next) {
  // Atualiza o campo `active` com base no `stockQuantity`
  this.active = this.stockQuantity > 0;
  next();
});

productSchema.pre('findOneAndUpdate', async function(next) {
  // Pega o documento que será atualizado
  const update = this.getUpdate();

  if (update.stockQuantity !== undefined) {
    // Atualiza `active` com base no novo valor de `stockQuantity`
    const activeStatus = update.stockQuantity > 0;
    this.setUpdate({ ...update, active: activeStatus });
  }

  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
