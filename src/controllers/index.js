const express = require("express")

const index = {
  get: function (req, res) {
    res.render("index", { title: "Index" })
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

module.exports = { index }
