const { createUser, activateAccount, login, updateUser, getUserInfo, forgotPassword, checkForgotPass, udpatePassword, loginWithGoogle } = require('../controllers/user')
const upload = require("../middlewares/upload")
const { getDecodedOAuthJwtGoogle } = require('../middlewares/verifyGoogleToken')
const verifyToken = require('../middlewares/verifyToken')

const router = require('express').Router()

router.post("/register", createUser)
router.post("/activate", activateAccount)
router.post("/login", login)
router.patch("/update", verifyToken, upload.single("photo"), updateUser)
router.get("/info", verifyToken, getUserInfo)
router.post('/forgot', forgotPassword)
router.post("/checkforgot", checkForgotPass)
router.put("/updatepass", udpatePassword)
router.post('/google', getDecodedOAuthJwtGoogle, loginWithGoogle)

module.exports = router