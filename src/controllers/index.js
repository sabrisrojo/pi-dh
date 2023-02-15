const express = require("express")
const session = require("express-session")
const {
  getAllCategories,
  getThreeCategoriesAtRandom,
} = require("../database/models/services/category")
const {
  getFiveProductsAtRandom,
} = require("../database/models/services/products")
const productsFromFolder = require("../utils/dataImportFromFiles")
const {
  isUserLoggedIn,
  retrieveUserSession,
} = require("../utils/validation/userLoggedIn")

const index = {
  get: async function (req, res) {
    const categories = await getThreeCategoriesAtRandom()
    const data = await getFiveProductsAtRandom()
    const userData = await retrieveUserSession(req)
    res.render("index", {
      title: "Home",
      categories: categories,
      data: data,
      userData: userData,
    })
  },
  post: function (req, res) {
    console.log(req.body)
    res.send("POST request to the register")
  },
  put: function (req, res) {
    console.log(req.body)
    res.send("PUT request to the register")
  },
  delete: function (req, res) {
    console.log(req.body)
    res.send("DELETE request to the register")
  },
}

const cookies = {
  get: function (req, res) {
    console.log(req.cookies)
    res.send(req.cookies)
  },
  post: function (req, res) {
    res.cookie("lastAccessCookie", new Date(), { maxAge: 1000 * 60 * 60 * 24 })
    console.log(req.cookies.lastAccessCookie)
    res.send(req.cookies.lastAccessCookie)
  },
  put: function (req, res) {
    res.send("PUT request to the cookies")
  },
  delete: function (req, res) {
    res.cookie("lastAccessCookie", null, { maxAge: 0 })
    console.log(req.cookies.lastAccessCookie)
    res.send(req.cookies.lastAccessCookie)
  },
}

const sessions = {
  get: function (req, res) {
    console.log(req.session)
    res.send(req.session)
  },
  post: function (req, res) {
    req.session.lastAccessSession = new Date()
    console.log(req.session.lastAccessSession)
    res.send(req.session.lastAccessSession)
  },
  put: function (req, res) {
    res.send("PUT request to the cookies")
  },
  delete: function (req, res) {
    req.session.lastAccessSession = null
    console.log(req.session.lastAccessSession)
    res.send(req.session.lastAccessSession)
  },
}

const products = {
  get: function (req, res) {
    res.send(productsFromFolder)
  },
  post: function (req, res) {
    req.session.lastAccessSession = new Date()
    console.log(req.session.lastAccessSession)
    res.send(req.session.lastAccessSession)
  },
  put: function (req, res) {
    res.send("PUT request to the cookies")
  },
  delete: function (req, res) {
    req.session.lastAccessSession = null
    console.log(req.session.lastAccessSession)
    res.send(req.session.lastAccessSession)
  },
}

module.exports = { index, cookies, sessions, products }
