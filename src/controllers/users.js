const express = require("express")
const { validationResult } = require("express-validator")

const register = {
  get: function (req, res) {
    res.render("register", { title: "Register" })
  },
  post: function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("register", {
        title: "Register",
        errors: errors.mapped(),
        old: req.body,
      })
    }
    res.send("POST request to the register")
  },
}

const login = {
  get: function (req, res) {
    res.render("login", { title: "Login" })
  },
  post: function (req, res) {
    console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("login", {
        title: "Login",
        errors: errors.mapped(),
        old: req.body,
      })
    }
    res.send("POST request to the login")
  },
}

const logout = {
  get: function (req, res) {
    res.render("logout", { title: "Logout" })
  },
  post: function (req, res) {
    console.log(req.body)
    res.send("POST request to the logout")
  },
}

const upload = {
  get: function (req, res) {
    res.render("uploadImage", { title: "Upload Your Image" })
  },
  post: function (req, res, next) {
    const file = req.file
    if (!file) {
      const error = new Error("Please upload a file")
      error.httpStatusCode = 400
      return next(error)
    }
    res.send(file)
  },
}

module.exports = {
  register,
  login,
  logout,
  upload,
}
