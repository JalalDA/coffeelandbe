const router = require("express").Router()
const userRouter = require('./user')
const productRouter = require("./product")
const categoryRouter = require("./category")
const orderRouter = require("./order")
const cartRouter = require("./cart")

router.use('/user', userRouter )
router.use("/product", productRouter )
router.use("/category", categoryRouter)
router.use("/order", orderRouter)
router.use("/cart", cartRouter)

module.exports = router