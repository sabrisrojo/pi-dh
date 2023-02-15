const { Cart, Product } = require("../models")
const { v4: uuidv4 } = require("uuid")

const cartService = {
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
}

module.exports = cartService
