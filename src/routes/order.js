const { addOrder, getAllOrder, getSingleOrder } = require('../controllers/Order')

const router = require('express').Router()

router.post('/add', addOrder)
router.post("/all", getAllOrder)
router.get('/:id', getSingleOrder)

module.exports = router