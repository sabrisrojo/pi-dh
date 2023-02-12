const { Sequelize, Model, DataTypes, Op, UUIDV4 } = require("sequelize")
const db = require(".")
const { hashPassword, comparePassword } = require("../../utils/hash/password")
const productsFromFolder = require("../../utils/dataImportFromFiles")
const config = require("../config")
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    dialect: config.development.dialect,
  }
)
const { v4: uuidv4 } = require("uuid")

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

async function createProduct(product) {
  try {
    const newProduct = await Product.create(product)
    return newProduct
  } catch (err) {
    throw err
  }
}

async function getAllProducts() {
  try {
    const products = await Product.findAll()
    return products
  } catch (err) {
    throw err
  }
}

// search by product name
async function searchProductsByName(name) {
  try {
    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: "%" + name + "%",
        },
      },
    })
    return products
  } catch (err) {
    throw err
  }
}

async function getOneProduct(id) {
  try {
    const product = await Product.findOne({
      where: {
        id: id,
      },
    })
    return product
  } catch (err) {
    throw err
  }
}

async function getOneProductPyProductId(productId) {
  try {
    const product = await Product.findOne({
      where: {
        productId: productId,
      },
    })
    return product
  } catch (err) {
    throw err
  }
}

async function getAllProductsByCategoryName(categoryName) {
  try {
    const products = await Product.findAll({
      where: {
        category: categoryName,
      },
    })
    return products
  } catch (err) {
    throw err
  }
}

async function getFiveProductsAtRandom() {
  try {
    const products = await Product.findAll({
      order: sequelize.random(),
      limit: 5,
    })
    return products
  } catch (err) {
    throw err
  }
}

async function getTwoProductsOfSameCategoryAtRandom(id, categoryName) {
  try {
    const products = await Product.findAll({
      where: {
        id: {
          [Op.ne]: id,
        },
        category: categoryName,
      },
      order: sequelize.random(),
      limit: 2,
    })
    return products
  } catch (err) {
    throw err
  }
}

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

Product.hasMany(Category, {
  foreignKey: "category",
  targetKey: "name",
  onDelete: "CASCADE",
})

async function createCategory(category) {
  try {
    const newCategory = await Category.create(category)
    return newCategory
  } catch (err) {
    throw err
  }
}

async function getAllCategories() {
  try {
    const categories = await Category.findAll()
    return categories
  } catch (err) {
    throw err
  }
}

async function getThreeCategoriesAtRandom() {
  try {
    const categories = await Category.findAll({
      limit: 3,
      order: sequelize.random(),
    })
    return categories
  } catch (err) {
    throw err
  }
}

async function createUser(username, email, password) {
  try {
    if (!userExists(username, email)) {
      return { success: false, message: "User already exists" }
    }
    const userData = await User.create({
      username,
      email,
    })
    const passwordData = await Password.create({
      userId: userData.userId,
      password: await hashPassword(password),
    })
    return { success: true, userData, passwordData }
  } catch (err) {
    console.log(err)
    return {
      success: false,
      msg: "Houve um problema na sua requisição",
    }
  }
}

async function getUser(userId) {
  try {
    const userData = await User.findOne({
      where: {
        userId,
      },
    })
    const passwordData = await Password.findOne({
      where: {
        userId,
      },
    })
    return {
      userId: userData.userId,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      shippingRecipient:
        userData.firstName && userData.lastName
          ? userData.firstName + " " + userData.lastName
          : null,
      shippingAddress: userData.shippingAddress,
      shippingAddress: userData.shippingAddress,
      shippingCity: userData.shippingCity,
      avatar: userData.avatar ? userData.avatar : "/images/avatars/default.png",
    }
  } catch (err) {
    throw err
  }
}

async function userExists(username, email) {
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

async function deleteUser(userId) {
  try {
    const userData = await User.destroy({
      where: {
        userId,
      },
    })
    const passwordData = await Password.destroy({
      where: {
        userId,
      },
    })
    return { userData, passwordData }
  } catch (err) {
    throw err
  }
}

async function loginUser(username, password) {
  try {
    const userData = await User.findOne({
      where: {
        username,
      },
    })
    if (!userData) {
      return false
    }
    const passwordData = await Password.findOne({
      where: {
        userId: userData.userId,
      },
    })

    const isLoginValid = comparePassword(password, passwordData.password)

    if (isLoginValid) {
      return {
        userId: userData.userId,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        shippingRecipient:
          userData.firstName && userData.lastName
            ? userData.firstName + " " + userData.lastName
            : null,
        shippingAddress: userData.shippingAddress,
        shippingCity: userData.shippingCity,
        avatar: userData.avatar
          ? userData.avatar
          : "/images/avatars/default.png",
      }
    } else {
      return false
    }
  } catch (err) {
    throw err
  }
}

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

Cart.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  sourceKey: "userId",
  onDelete: "CASCADE",
})

async function getCart(userId) {
  try {
    const cart = await Cart.findAll({
      where: {
        userId,
      },
    })
    return cart
  } catch (err) {
    throw err
  }
}

async function addToCart(userId, productId) {
  try {
    const cart = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    })
    if (cart) {
      const updatedCart = await Cart.update(
        {
          quantity: cart.quantity + 1,
        },
        {
          where: {
            userId,
            productId,
          },
        }
      )
      return updatedCart
    } else {
      const newCart = await Cart.create({
        userId,
        productId,
        price,
        quantity: 1,
      })
      return newCart
    }
  } catch (err) {
    throw err
  }
}

async function updateUserProfile(body) {
  try {
    const user = await User.findOne({
      where: {
        username: body.username,
      },
    })
    if (user) {
      const updatedUser = await User.update(
        {
          firstName: body.firstName,
          lastName: body.lastName,
          shippingAddress: body.shippingAddress,
          shippingCity: body.shippingCity,
        },
        {
          where: {
            username: user.dataValues.username,
          },
        }
      )
      return body
    } else {
      return false
    }
  } catch (err) {
    throw err
  }
}

async function updateUserAvatar(username, avatar) {
  try {
    const user = await User.findOne({
      where: {
        username,
      },
    })
    if (user) {
      const updatedUser = await User.update(
        {
          avatar: "/images/avatars/" + avatar.filename,
        },
        {
          where: {
            username,
          },
        }
      )
      return true
    } else {
      return false
    }
  } catch (err) {
    throw err
  }
}

async function getUserAvatar(username) {
  try {
    const user = await User.findOne({
      where: {
        username,
      },
    })
    if (user) {
      return user.avatar
    } else {
      return false
    }
  } catch (err) {
    throw err
  }
}

async function saveCartToDatabase(userId, cart) {
  try {
    const cartId = uuidv4()
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
    })
    if (cartItems.length > 0) {
      await Cart.destroy({
        where: {
          userId,
          orderCreated: false,
        },
      })
    }
    for (let i = 0; i < Object.keys(cart).length; i++) {
      const product = await Product.findOne({
        where: {
          productId: Object.keys(cart)[i],
        },
      })
      await Cart.create({
        userId,
        cartId,
        productId: product.productId,
        price: product.price,
        quantity: Object.values(cart)[i],
      })
    }

    return true
  } catch (err) {
    throw err
  }
}

async function getCartFromDatabase(userId) {
  try {
    const cart = await Cart.findAll({
      where: {
        userId,
        orderCreated: false,
      },
    })
    const cartdId = cart[0].cartId

    const cartPrice = await Cart.findAll({
      where: {
        cartId: cartdId,
      },
      attributes: ["price", "quantity"],
    })

    let totalPrice = 0
    cartPrice.forEach((item) => {
      totalPrice += item.dataValues.price * item.dataValues.quantity
    })

    console.log(totalPrice)

    return { cartdId, cart, totalPrice }
  } catch (err) {
    throw err
  }
}

async function deleteCart(userId) {
  try {
    const cart = await Cart.destroy({
      where: {
        userId,
      },
    })
    return cart
  } catch (err) {
    throw err
  }
}

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

async function createOrder(userId, cartId, total) {
  try {
    const order = await Order.create({
      userId,
      cartId,
      total,
    })

    const cart = await Cart.update(
      {
        orderCreated: true,
      },
      {
        where: {
          cartId,
        },
      }
    )
    return order
  } catch (err) {
    throw err
  }
}

async function getOrder(id) {
  try {
    const order = await Order.findOne({
      where: {
        id,
      },
    })
    return order
  } catch (err) {
    throw err
  }
}

async function getProductsFromOrder(id) {
  try {
    let order = await Order.findOne({
      where: {
        id,
      },
    })
    const cartProducts = await Cart.findAll({
      where: {
        cartId: order.cartId,
      },
    })
    const productsData = []

    for (let i = 0; i < cartProducts.length; i++) {
      const product = await Product.findOne({
        where: {
          productId: cartProducts[i].productId,
        },
        attributes: ["id", "productId", "name", "imagePath"],
      })
      productsData.push({
        id: product.id,
        productId: product.productId,
        name: product.name,
        imagePath: product.imagePath,
        price: cartProducts[i].price,
        quantity: cartProducts[i].quantity,
      })
    }

    const orderData = order.dataValues
    const shippingCost = orderData.expressShipping ? 15.0 : 5.0
    const subTotal = parseFloat(orderData.total) + shippingCost
    let status = ""

    switch (order.statusId) {
      case 1:
        status = "Aguardando Informações de Envio"
        break
      case 2:
        status = "Aguardando Informações de Pagamento"
        break
      case 3:
        status = "Aguardando Confirmação do Pedido"
        break
      case 4:
        status = "Finalizado"
        break
      default:
        status = "Aguardando Informações de Envio"
    }
    order = { ...orderData, subTotal, shippingCost, status }

    return { order, productsData }
  } catch (err) {
    throw err
  }
}

async function getOrders(userId) {
  try {
    let orders = await Order.findAll({
      where: {
        userId,
      },
    })

    for (let i = 0; i < orders.length; i++) {
      switch (orders[i].statusId) {
        case 1:
          orders[i].status = "Aguardando Informações de Envio"
          break
        case 2:
          orders[i].status = "Aguardando Informações de Pagamento"
          break
        case 3:
          orders[i].status = "Aguardando Confirmação do Pedido"
          break
        case 4:
          orders[i].status = "Finalizado"
          break
        default:
          orders[i].status = "Aguardando Informações de Envio"
          break
      }
    }
    return orders
  } catch (err) {
    throw err
  }
}

async function deleteOrder(id) {
  try {
    const order = await Order.findOne({
      where: {
        id,
      },
    })

    if (!order) {
      throw new Error("Order not found")
    }

    if (order.orderCompleted) {
      throw new Error("Order already completed")
    }

    await Order.destroy({
      where: {
        orderId: order.orderId,
      },
    })

    await Cart.destroy({
      where: {
        cartId: order.cartId,
      },
    })

    return true
  } catch (err) {
    throw err
  }
}

async function updateOrderShippingDetails(orderId, orderShippingDetails) {
  try {
    expressShipping =
      orderShippingDetails.expressShipping === "true" ? true : false
    await Order.update(
      {
        shippingAddress: orderShippingDetails.shippingAddress,
        shippingCity: orderShippingDetails.shippingCity,
        shippingRecipient: orderShippingDetails.shippingRecipient,
        expressShipping,
        shippingDetailsCompleted: true,
        statusId: 2,
      },
      {
        where: {
          orderId,
        },
      }
    )
    const order = await Order.findOne({
      where: {
        orderId,
      },
    })
    return order
  } catch (err) {
    throw err
  }
}

async function updateOrderPaymentDetails(orderId, creditCardPayment) {
  try {
    creditCardPayment === "true" ? true : false

    let order = await Order.findOne({
      where: {
        orderId,
      },
      attributes: ["total", "expressShipping"],
    })

    let orderFinalTotal = order.expressShipping
      ? parseFloat(order.total) + 15
      : parseFloat(order.total) + 5

    orderFinalTotal = (
      creditCardPayment === "true" ? orderFinalTotal : orderFinalTotal * 0.9
    ).toFixed(2)

    await Order.update(
      {
        creditCardPayment,
        paymentDetailsCompleted: true,
        orderFinalTotal,
        statusId: 3,
      },
      {
        where: {
          orderId,
        },
      }
    )
    order = await Order.findOne({
      where: {
        orderId,
      },
    })
    return order
  } catch (err) {
    throw err
  }
}

async function completeOrder(id) {
  try {
    let order = await Order.findOne({
      where: {
        id,
      },
    })

    if (!order) {
      throw new Error("Order not found")
    }

    if (order.orderCompleted) {
      throw new Error("Order already completed")
    }

    await Order.update(
      {
        orderCompleted: true,
        statusId: 4,
      },
      {
        where: {
          id,
        },
      }
    )

    order = await Order.findOne({
      where: {
        id,
      },
    })

    order = order.dataValues

    return order
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
  Product,
  User,
  Password,
  createUser,
  deleteUser,
  getUser,
  loginUser,
  getOneProduct,
  getAllProducts,
  createProduct,
  createCategory,
  getAllCategories,
  getAllProductsByCategoryName,
  getThreeCategoriesAtRandom,
  getFiveProductsAtRandom,
  getTwoProductsOfSameCategoryAtRandom,
  getCart,
  addToCart,
  getOneProductPyProductId,
  userExists,
  updateUserProfile,
  updateUserAvatar,
  getUserAvatar,
  saveCartToDatabase,
  getCartFromDatabase,
  createOrder,
  getOrder,
  getProductsFromOrder,
  getOrders,
  deleteOrder,
  updateOrderShippingDetails,
  updateOrderPaymentDetails,
  completeOrder,
  searchProductsByName,
}

