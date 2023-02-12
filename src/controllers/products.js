const {
  getAllProducts,
  getOneProduct,
  getAllProductsByCategoryName,
  getAllCategories,
  getTwoProductsOfSameCategoryAtRandom,
  searchProductsByName,
} = require("../database/models/models")
const { retrieveUserSession } = require("../utils/validation/userLoggedIn")

module.exports = {
  getOneProductById: async (req, res) => {
    const data = await getOneProduct(req.params.id)
    const relatedProducts = await getTwoProductsOfSameCategoryAtRandom(
      data.id,
      data.category
    )

    const userData = await retrieveUserSession(req)
    res.render("product", {
      title: "Product",
      data: data,
      relatedProducts: relatedProducts,
      userData: userData,
    })
  },
  getAllProductsByCategory: async (req, res) => {
    let query = req.params.query
    query = query.charAt(0).toUpperCase() + query.slice(1)

    const productsByCategory = await getAllProductsByCategoryName(
      req.params.query
    )

    const userData = await retrieveUserSession(req)
    res.render("products", {
      title: "Departamento",
      category: query,
      data: productsByCategory,
      userData: userData,
    })
  },
  getAllProductsCategories: async (req, res) => {
    const categories = await getAllCategories()

    const userData = await retrieveUserSession(req)
    res.render("category", {
      title: "Categorias",
      data: categories,
      userData: userData,
    })
  },
  getAllProducts: async (req, res) => {
    const products = await getAllProducts()

    const userData = await retrieveUserSession(req)
    res.render("products", {
      title: "Products",
      data: products,
      userData: userData,
    })
  },
  getProductByProductName: async (req, res) => {
    const products = await searchProductsByName(req.query.name)

    const userData = await retrieveUserSession(req)
    res.render("products", {
      title: "Products",
      data: products,
      userData: userData,
    })
  },
}
