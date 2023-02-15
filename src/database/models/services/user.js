const { Op } = require("sequelize")
const {
  hashPassword,
  comparePassword,
} = require("../../../utils/hash/password")
const { User, Password } = require("../models")

const userService = {
  userExists: async (username, email) => {
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
  },
  createUser: async (username, email, password) => {
    try {
      if (!userService.userExists(username, email)) {
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
}

module.exports = userService
