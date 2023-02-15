const { Order, Cart, Product } = require("../models")

const orderService = {
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

module.exports = orderService
