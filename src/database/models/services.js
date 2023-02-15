const { Sequelize, Op } = require("sequelize")
const { hashPassword, comparePassword } = require("../../utils/hash/password")
const { v4: uuidv4 } = require("uuid")
const config = require("../config")
const {
  User,
  Password,
  Category,
  Product,
  Cart,
  Order,
  userExists,
} = require("./models")
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    dialect: config.development.dialect,
  }
)

module.exports = {
  getAllProducts: async () => {
    try {
      const products = await Product.findAll()
      return products
    } catch (err) {
      throw err
    }
  },
  searchProductsByName: async (name) => {
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
  },
  getOneProduct: async (id) => {
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
  },
  getOneProductPyProductId: async (productId) => {
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
  },
  getAllProductsByCategoryName: async (categoryName) => {
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
  },
  getFiveProductsAtRandom: async () => {
    try {
      const products = await Product.findAll({
        order: sequelize.random(),
        limit: 5,
      })
      return products
    } catch (err) {
      throw err
    }
  },
  getTwoProductsOfSameCategoryAtRandom: async (id, categoryName) => {
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
  },
  getAllCategories: async () => {
    try {
      const categories = await Category.findAll()
      return categories
    } catch (err) {
      throw err
    }
  },
  getThreeCategoriesAtRandom: async () => {
    try {
      const categories = await Category.findAll({
        limit: 3,
        order: sequelize.random(),
      })
      return categories
    } catch (err) {
      throw err
    }
  },
  createUser: async (username, email, password) => {
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
  },
  getUser: async (userId) => {
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
        avatar: userData.avatar
          ? userData.avatar
          : "/images/avatars/default.png",
      }
    } catch (err) {
      throw err
    }
  },
  deleteUser: async (userId) => {
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
  },
  loginUser: async (username, password) => {
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
  },
  getCart: async (userId) => {
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
  },
  addToCart: async (userId, productId) => {
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
  },
  updateUserProfile: async (body) => {
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
  },
  updateUserAvatar: async (username, avatar) => {
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
  },
  getUserAvatar: async (username) => {
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
  },
  saveCartToDatabase: async (userId, cart) => {
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
  },
  getCartFromDatabase: async (userId) => {
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
  },
  deleteCart: async (userId) => {
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
  },
  createOrder: async (userId, cartId, total) => {
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
  },
  getOrder: async (id) => {
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
  },
  getProductsFromOrder: async (id) => {
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
  },
  getOrders: async (userId) => {
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
  },
  deleteOrder: async (id) => {
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
  },
  updateOrderShippingDetails: async (orderId, orderShippingDetails) => {
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
  },
  updateOrderPaymentDetails: async (orderId, creditCardPayment) => {
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
  },
  completeOrder: async (id) => {
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
  },
}
