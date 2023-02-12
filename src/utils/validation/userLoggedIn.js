const { userExists } = require("../../database/models/models")

module.exports = {
  isUserLoggedIn: async function (req, res, next) {
    if (req.session.user) {
      const { username, email } = req.session.user
      const user = await userExists(username, email)

      if (user) {
        if (req.url === "/login" || req.url === "/register") {
          res.redirect("/")
        } else {
          next()
        }
      } else {
        res.redirect("/users/login")
      }
    } else {
      if (req.url === "/login" || req.url === "/register") {
        next()
      } else {
        res.redirect("/users/login")
      }
    }
  },
  retrieveUserSession: async (req) => {
    if (
      req.session.user &&
      (await userExists(req.session.user.username, req.session.user.email))
    ) {
      return req.session.user
    } else {
      return false
    }
  },
}
