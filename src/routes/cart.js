const { addCart, getCartByUserId, deleteProductFromCart } = require("../controllers/Cart")
const verifyToken = require("../middlewares/verifyToken")

const router = require("express").Router()

router.post("/add", verifyToken, addCart)
router.get("/get", verifyToken, getCartByUserId)
router.post("/delete", verifyToken, deleteProductFromCart)

module.exports = router