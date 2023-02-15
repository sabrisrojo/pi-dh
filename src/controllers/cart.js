const {
  saveCartToDatabase,
  getCartFromDatabase,
} = require("../database/models/services/cart")
const { createOrder } = require("../database/models/services/order")
const {
  getOneProductPyProductId,
} = require("../database/models/services/products")
const { retrieveUserSession } = require("../utils/validation/userLoggedIn")
const { getOneProductById } = require("./products")

module.exports = {
  getCart: async (req, res) => {
    if (!req.session.cart) {
      req.session.cart = {}
    }

    const productsWithQuantity = Object.keys(req.session.cart).map(
      (productId) => {
        return {
          productId,
          quantity: req.session.cart[productId],
        }
      }
    )

    const cartData = await Promise.all(
      productsWithQuantity.map(async (productWithQuantity) => {
        const product = await getOneProductPyProductId(
          productWithQuantity.productId
        )
        return {
          id: product.id,
          productId: product.productId,
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: productWithQuantity.quantity,
          imagePath: product.imagePath,
        }
      })
    )

    const totalPrice = cartData.reduce((acc, product) => {
      return acc + product.price * product.quantity
    }, 0)

    const userData = await retrieveUserSession(req)
    res.render("cart", { title: "Carrinho", cartData, totalPrice, userData })
  },
  addProductToCart: async (req, res) => {
    const { productId } = req.params
    const { cart } = req.session
    if (cart) {
      cart[productId] = cart[productId] + 1 || 1
    } else {
      req.session.cart = { [productId]: 1 }
    }

    const preCartData = await getOneProductPyProductId(productId)

    const preCart = {
      id: preCartData.id,
      productId: preCartData.productId,
      name: preCartData.name,
      category: preCartData.category,
      price: preCartData.price,
      imagePath: preCartData.imagePath,
    }

    res.render("preCart", { title: "Carrinho", preCart })
  },
  increaseProductFromCart: (req, res) => {
    const { productId } = req.params
    const { cart } = req.session
    if (cart) {
      cart[productId] = cart[productId] + 1 || 1
    } else {
      req.session.cart = { [productId]: 1 }
    }
    res.redirect("/cart")
  },
  removeProductFromCart: (req, res) => {
    const { productId } = req.params
    const { cart } = req.session
    if (cart) {
      delete cart[productId]
    }
    res.redirect("/cart")
  },
  decreaseProductFromCart: (req, res) => {
    const { productId } = req.params
    const { cart } = req.session
    if (cart) {
      cart[productId] = cart[productId] - 1 || 1
    } else {
      req.session.cart = { [productId]: 1 }
    }
    res.redirect("/cart")
  },
  checkout: async (req, res) => {
    const { cart } = req.session

    const userData = await retrieveUserSession(req)

    try {
      if (cart) {
        const cartSaved = await saveCartToDatabase(userData.userId, cart)
        const cartFromDb = await getCartFromDatabase(userData.userId)
        const order = await createOrder(
          userData.userId,
          cartFromDb.cartdId,
          cartFromDb.totalPrice
        )
        req.session.cart = {}
        res.redirect("/users/history/" + order.dataValues.id)
      }
      return false
    } catch (e) {
      console.log(e)
    }
  },
}
