const { Sequelize, Model, DataTypes, Op, UUIDV4 } = require("sequelize")
const config = require("../config")
const productsFromFolder = require("../../utils/dataImportFromFiles")
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    dialect: config.development.dialect,
  }
)

const User = sequelize.define(
  "user",
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User ID is required",
        },
        notEmpty: {
          msg: "User ID is required",
        },
      },
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: {
        arg: true,
        msg: "This username is already taken.",
      },
      validate: {
        notNull: {
          msg: "Username is required",
        },
        notEmpty: {
          msg: "Username is required",
        },
      },
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: {
        arg: true,
        msg: "This email is already taken.",
      },
      validate: {
        notNull: {
          msg: "Email is required",
        },
        notEmpty: {
          msg: "Email is required",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: "/images/avatars/default.png",
    },
    shippingAddress: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    shippingCity: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    shippingRecipient: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Created at is required",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    paranoid: true,
  }
)

const Password = sequelize.define(
  "password",
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User ID is required",
        },
        notEmpty: {
          msg: "User ID is required",
        },
      },
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required",
        },
        notEmpty: {
          msg: "Password is required",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Password",
    paranoid: true,
  }
)

const Category = sequelize.define(
  "category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category ID is required",
        },
        notEmpty: {
          msg: "Category ID is required",
        },
      },
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: {
        arg: true,
        msg: "This category name is already taken.",
      },
      validate: {
        notNull: {
          msg: "Category name is required",
        },
        notEmpty: {
          msg: "Category name is required",
        },
      },
    },
    imagePath: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
    paranoid: true,
  }
)

const Product = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Product ID is required",
        },
        notEmpty: {
          msg: "Product ID is required",
        },
      },
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: {
        arg: true,
        msg: "This product name is already taken.",
      },
      validate: {
        notNull: {
          msg: "Product name is required",
        },
        notEmpty: {
          msg: "Product name is required",
        },
      },
    },
    imagePath: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Product price is required",
        },
        notEmpty: {
          msg: "Product price is required",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Product",
    paranoid: true,
  }
)

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderCreated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Cart",
    timestamps: false,
  }
)

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    creditCardPayment: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingRecipient: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    expressShipping: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingDetailsCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    paymentDetailsCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    orderFinalTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    orderCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "Order",
  }
)

User.hasOne(Password, {
  foreignKey: "userId",
  sourceKey: "userId",
  onDelete: "CASCADE",
})

Password.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: "CASCADE",
})

Product.hasMany(Category, {
  foreignKey: "category",
  targetKey: "name",
  onDelete: "CASCADE",
})

Cart.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  sourceKey: "userId",
  onDelete: "CASCADE",
})

User.hasMany(Order, {
  foreignKey: "userId",
  sourceKey: "userId",
  targetKey: "userId",
  onDelete: "CASCADE",
})

Order.belongsTo(User, {
  foreignKey: "userId",
  sourceKey: "userId",
  targetKey: "userId",
  onDelete: "CASCADE",
})

const createCategory = async (category) => {
  try {
    const newCategory = await Category.create(category)
    return newCategory
  } catch (err) {
    throw err
  }
}

const createProduct = async (product) => {
  try {
    const newProduct = await Product.create(product)
    return newProduct
  } catch (err) {
    throw err
  }
}

const userExists = async (username, email) => {
  try {
    const userData = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    })
    return true
  } catch (err) {
    throw err
  }
}

sequelize
  .query("SET FOREIGN_KEY_CHECKS = 0")
  .then(function () {
    return sequelize.sync({ force: true })
  })
  .then(function () {
    const categories = [
      {
        name: "Cadeiras",
        imagePath: "/images/A Cadeira Gamer ThunderX3 EC3 Reclinável.png",
      },
      {
        name: "Mesas",
        imagePath: "images/Mesa Gamer DT3Sports Infinity, Black.png",
      },
      {
        name: "Kit Gamer",
        imagePath:
          "/images/Kit Gamer 5 em 1 Onikuma com Headset com Suporte + Teclado + Mouse + MousePad, Preto - X7PRO.png",
      },
      {
        name: "Headsets",
        imagePath:
          "/images/Headset Gamer Redragon Lamia 2, RGB, 7.1 Som Surrond, Drivers 40mm, Branco.png",
      },
      {
        name: "Teclados",
        imagePath:
          "/images/Teclado Gamer HyperX Alloy Core, RGB, ABNT2 - HX-KB5ME2-BR.png",
      },
      {
        name: "Mouses",
        imagePath:
          "/images/Mouse Gamer Multi Gunter, LED Rainbow, 6400 DPI, 6 Botões, Preto.png",
      },
      {
        name: "Mousepads",
        imagePath: "/images/Mousepad Gamer Havit Control.png",
      },
      {
        name: "Webcams",
        imagePath:
          "/images/Webcam Full HD Logitech C920s com Microfone Embutido, Proteção de Privacidade, Widescreen 1080p, Compatível Logitech Capture.png",
      },
    ]
    return categories.map((category) => {
      return createCategory(category)
    })
  })
  .then(function () {
    return productsFromFolder.map((product) => {
      return createProduct(product)
    })
  })
  .then(function () {
    return sequelize.query("SET FOREIGN_KEY_CHECKS = 1")
  })
  .then(
    function () {
      console.log("Database synchronised.")
    },
    function (err) {
      console.log(err)
    }
  )

module.exports = {
  User,
  Password,
  Category,
  Product,
  Cart,
  Order,
  createCategory,
  createProduct,
  userExists,
}

