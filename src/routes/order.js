const { addOrder, getAllOrder, getSingleOrder, createTransaction } = require('../controllers/Order')
const verifyToken = require('../middlewares/verifyToken')

const router = require('express').Router()

router.post('/add', addOrder)
router.post("/all", getAllOrder)
router.get('/:id', getSingleOrder)
router.post('/transaction', verifyToken, createTransaction)

module.exports = router