const { addCategory } = require("../controllers/Category")
const router = require("express").Router()


router.post("/add", addCategory)

module.exports = router