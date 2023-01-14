const express = require("express")

const register = {
  get: function (req, res) {
    res.render("register", { title: "Register" })
  },
  post: function (req, res) {
    console.log(req.body)
    res.send("POST request to the register")
  },
}

const login = {
  get: function (req, res) {
    res.render("login", { title: "Login" })
  },
  post: function (req, res) {
    console.log(req.body)
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
    res.send("POST request to the upload")
  },
}

module.exports = {
  register,
  login,
  logout,
  upload,
}
