const fs = require("fs")
const path = require("path")

const getImageFromFolder = fs
  .readdirSync(path.join(__dirname, "../../public/images"))
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file.slice(-4) === ".png" &&
      file.indexOf("_") === -1
    )
  })
  .map((file) => {
    return {
      name: file.slice(0, -4),
      imagePath: `/images/${file}`,
    }
  })

const getDataFromFolder = fs
  .readdirSync(path.join(__dirname, "../../public/images"))
  .filter((file) => {
    return file.indexOf(".") !== 0 && file.slice(-4) === ".txt"
  })
  .map((file) => {
    const fileContent = fs
      .readFileSync(path.join(__dirname, `../../public/images/${file}`), "utf8")
      .split("#")
      .map((line) => line.trim())

    return {
      name: file.slice(0, -4),
      description: fileContent[0].slice(
        0,
        fileContent[0].slice(0, 400).lastIndexOf(".") + 1 || 400
      ),
      category: fileContent[1],
      price: fileContent[2]
        .replace("R$ ", "")
        .replace(".", "")
        .replace(",", "."),
    }
  })

// join the two arrays
const productsFromFolder = getImageFromFolder.map((image) => {
  const productData = getDataFromFolder.find((file) => file.name === image.name)
  return {
    ...image,
    ...productData,
  }
})

module.exports = productsFromFolder
