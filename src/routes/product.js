const { addProduct, updateProduct, getProduct, getAllProduct, deleteProduct } = require("../controllers/Product")
const upload = require("../middlewares/upload")

const router = require("express").Router()

router.post('/add', upload.single("image"), addProduct)
router.patch('/update', upload.single("image"), updateProduct)
router.get('/:product_id', getProduct)
router.post('/all', getAllProduct)
router.patch('/delete', deleteProduct)

module.exports = router