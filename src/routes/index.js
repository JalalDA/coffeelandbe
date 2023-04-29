const router = require("express").Router()
const userRouter = require('./user')
const productRouter = require("./product")
const categoryRouter = require("./category")
const orderRouter = require("./order")

router.use('/user', userRouter )
router.use("/product", productRouter )
router.use("/category", categoryRouter)
router.use("/order", orderRouter)

module.exports = router