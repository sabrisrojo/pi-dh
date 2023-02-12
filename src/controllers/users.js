const express = require("express")
const { validationResult } = require("express-validator")
const db = require("../database/models")
const {
  createUser,
  deleteUser,
  loginUser,
  updateUserProfile,
  getUser,
  updateUserAvatar,
  getUserAvatar,
  getOrders,
  getOrder,
  getProductsFromOrder,
  updateOrder,
  updateOrderShippingDetails,
  updateOrderPaymentDetails,
  deleteOrder,
  completeOrder,
} = require("../database/models/models")
const { hashPassword } = require("../utils/hash/password")
const { retrieveUserSession } = require("../utils/validation/userLoggedIn")

const register = {
  get: function (req, res) {
    res.render("register", { title: "Registro" })
  },
  post: async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("register", {
        title: "Register",
        errors: errors.mapped(),
        old: req.body,
      })
    }

    const { username, email, password } = req.body

    try {
      const user = await createUser(username, email, password)

      if (!user.success) {
        return res.render("Register", {
          title: "Login",
          errors: {
            validation: {
              msg: userData.message,
            },
          },
          old: req.body,
        })
      }
      req.session.user = user.userData
      res.redirect("/")
    } catch (error) {
      console.log(error)
      return res.render("login", {
        title: "Login",
        errors: {
          validation: {
            msg: "Os dados inseridos já existem",
          },
        },
        old: req.body,
      })
    }
  },
  put: function (req, res) {
    res.send("PUT request to the register")
  },
  delete: function (req, res) {
    deleteUser(req.params.id)
      .then(({ userData, passwordData }) => {
        res.send("nice")
      })
      .catch((error) => {
        res.sendStatus(500)
      })
  },
}

const login = {
  get: function (req, res) {
    res.render("login", { title: "Login" })
  },
  post: async function (req, res) {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
      return res.render("login", {
        title: "Login",
        errors: errors.mapped(),
        old: req.body,
      })
    }

    const { username, password } = req.body

    try {
      const userData = await loginUser(username, password)

      if (!userData) {
        return res.render("login", {
          title: "Login",
          errors: {
            validation: {
              msg: "Usuário ou senha incorretos",
            },
          },
          old: req.body,
        })
      }
      req.session.user = userData
      res.redirect("/")
    } catch (error) {
      console.log(error)
      return res.render("login", {
        title: "Login",
        errors: {
          validation: {
            msg: "Houve um problema na sua requisição",
          },
        },
        old: req.body,
      })
    }
  },
}

const upload = {
  post: async function (req, res, next) {
    const errors = validationResult(req)
    let userData = await retrieveUserSession(req)
    if (!errors.isEmpty()) {
      return res.render("Profile", {
        title: "Atualizar Perfil",
        errors: errors.mapped(),
        old: req.body,
        userData,
      })
    }
    await updateUserAvatar(userData.username, req.file)
    userData = await getUser(req.session.user.userId)
    req.session.user = userData
    return res.render("profile", {
      title: "Perfil",
      old: req.body,
      userData,
    })
  },
}

module.exports = {
  register,
  login,
  upload,
  getRequest: async function (req, res) {
    res.send(req.body)
  },
  getHistory: async function (req, res) {
    const userData = await retrieveUserSession(req)
    const userOrders = await getOrders(userData.userId)
    res.render("history", {
      title: "Histórico de Pedidos",
      userOrders,
      userData,
    })
  },
  getOrderDetail: async function (req, res) {
    try {
      const userData = await retrieveUserSession(req)
      const orderDetail = await getProductsFromOrder(req.params.id)

      if (userData.userId !== orderDetail.order.userId) {
        return res.redirect("/users/history")
      }

      switch (orderDetail.order.statusId) {
        case 1:
          res.render("orderDetail", {
            title: "Detalhes da Entrega",
            orderDetail,
            userData,
          })
          break
        case 2:
          res.render("orderPayment", {
            title: "Pagamento do Pedido",
            orderDetail,
            userData,
          })
          break
        case 3:
          res.render("orderConfirmation", {
            title: "Confirmação do Pedido",
            orderDetail,
            userData,
          })
          break
        case 4:
          res.render("orderHistory", {
            title: "Histórico do Pedido",
            orderDetail,
            userData,
          })
          break
        default:
          return res.redirect("/users/history")
          break
      }
    } catch (error) {
      console.log(error)
      res.redirect("/users/history")
    }
  },
  getProfile: async function (req, res) {
    const userData = await retrieveUserSession(req)
    res.render("profile", { title: "Perfil", userData })
  },

  getOrderShipping: async function (req, res) {
    try {
      const userData = await retrieveUserSession(req)
      const orderDetail = await getProductsFromOrder(req.params.id)

      if (userData.userId !== orderDetail.order.userId) {
        return res.redirect("/users/history")
      }
      res.render("orderDetail", {
        title: "Confirmação do Pedido",
        orderDetail,
        userData,
      })
    } catch (error) {
      console.log(error)
      res.redirect("/users/history")
    }
  },

  updateOrderShipping: async function (req, res) {
    try {
      const userData = await retrieveUserSession(req)
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.render("history/" + req.params.id, {
          title: "Profile",
          errors: errors.mapped(),
          old: req.body,
        })
      }

      const orderId = req.body.orderId

      const orderShippingDetails = {
        shippingAddress: req.body.shippingAddress,
        shippingCity: req.body.shippingCity,
        shippingRecipient: req.body.shippingRecipient,
        expressShipping: req.body.expressShipping,
      }

      const order = await updateOrderShippingDetails(
        orderId,
        orderShippingDetails
      )

      const orderDetail = await getProductsFromOrder(req.params.id)

      if (userData.userId !== orderDetail.order.userId) {
        return res.redirect("/users/history")
      }

      res.render("orderPayment", {
        title: "Confirmação do Pedido",
        orderDetail,
        userData,
      })
    } catch (error) {
      console.log(error)
      res.redirect("/users/history")
    }
  },

  getOrderPayment: async function (req, res) {
    try {
      const userData = await retrieveUserSession(req)
      const orderDetail = await getProductsFromOrder(req.params.id)
      if (userData.userId !== orderDetail.order.userId) {
        return res.redirect("/users/history")
      }
      res.render("orderPayment", {
        title: "Confirmação do Pedido",
        orderDetail,
        userData,
      })
    } catch (error) {
      console.log(error)
      res.redirect("/users/history")
    }
  },

  updateOrderPayment: async function (req, res) {
    try {
      const userData = await retrieveUserSession(req)
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.render("history/" + req.params.id, {
          title: "Perfil",
          errors: errors.mapped(),
          old: req.body,
        })
      }

      const orderId = req.body.orderId
      const creditCardPayment = req.body.creditCardPayment
      const expressShipping = req.body.expressShipping
      const total = req.body.total

      const order = await updateOrderPaymentDetails(
        orderId,
        creditCardPayment,
        expressShipping,
        total
      )

      const orderDetail = await getProductsFromOrder(req.params.id)

      if (userData.userId !== orderDetail.order.userId) {
        return res.redirect("/users/history")
      }

      res.render("orderConfirmation", {
        title: "Pedido Realizado",
        orderDetail,
        userData,
      })
    } catch (error) {
      console.log(error)
      res.redirect("/users/history")
    }
  },

  getOrderConfirmation: async function (req, res) {
    try {
      const userData = await retrieveUserSession(req)
      const orderDetail = await getProductsFromOrder(req.params.id)

      if (userData.userId !== orderDetail.order.userId) {
        return res.redirect("/users/history")
      }
      res.render("orderConfirmation", {
        title: "Confirmação do Pedido",
        orderDetail,
        userData,
      })
    } catch (error) {
      console.log(error)
      res.redirect("/users/history")
    }
  },

  finishOrder: async function (req, res) {
    try {
      const userData = await retrieveUserSession(req)
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.render("history/" + req.params.id, {
          title: "Profile",
          errors: errors.mapped(),
          old: req.body,
        })
      }

      const orderDetail = await completeOrder(req.params.id)

      if (userData.userId !== orderDetail.order.userId) {
        return res.redirect("/users/history")
      }

      res.render("orderFinished", {
        title: "Obrigado pela sua compra!",
        orderDetail: { order: { id: orderDetail.id } },
        userData,
      })
    } catch (error) {
      console.log(error)
      res.redirect("/users/history")
    }
  },

  deleteOrder: async function (req, res) {
    try {
      const userData = await retrieveUserSession(req)
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.render("history/" + req.params.id, {
          title: "Profile",
          errors: errors.mapped(),
          old: req.body,
        })
      }

      const orderId = req.params.id
      const userId = req.body.userId

      if (userData.userId !== userId) {
        return res.redirect("/users/history")
      }

      const order = await deleteOrder(orderId)

      res.redirect("/users/history")
    } catch (error) {
      console.log(error)
      res.redirect("/users/history")
    }
  },

  updateProfile: async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("profile", {
        title: "Profile",
        errors: errors.mapped(),
        old: req.body,
      })
    }

    await updateUserProfile(req.body)
    const userData = await getUser(req.session.user.userId)
    req.session.user = userData
    return res.render("profile", {
      title: "Profile",
      old: req.body,
      userData,
    })
  },

  logoutCurrentUser: function (req, res) {
    req.session.destroy()
    res.redirect("/")
  },
}
