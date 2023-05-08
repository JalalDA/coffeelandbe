const dotenv = require('dotenv')
dotenv.config()
const express = require("express")
require('./src/auth/passport')
const app = express()
const db = require('./src/config/db')
const router = require('./src/routes/index')
const port = process.env.PORT
const client = require('./src/config/redis')
const cors = require('cors')
const {User, Product, Category, Order, OrderItem, Cart, CartItem} = require('./src/models/index')
const cloudinaryConfig = require('./src/config/cloudinary')
const fs = require('fs')
const https = require('https')

const key = fs.readFileSync('private.key')
const cert = fs.readFileSync('certificate.crt')

db.authenticate().then(() => {
    console.log(`DB Connected`);
}).catch((err) => {
    console.log({ err });
})
// User.sync()
// Product.sync()
// Category.sync()
// Order.sync()
// OrderItem.sync()
// Cart.sync()
// CartItem.sync()
client.connect()
    .then(() => {
        console.log(`Redis connected`)
    })
    .catch((err) => {
        console.log({ err });
    })
app.use(cors(
    {
        origin: ['*', 'http://localhost:3000', 'https://coffeelands-app.netlify.app'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        optionsSuccessStatus : 200
    }
))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cloudinaryConfig)
app.use(router)
app.listen(port, () => {
    console.log(`App listen on port ${port}`);
})

app.get("/", (req, res)=>{
    res.status(200).json({msg : "Wellcome to Coffeeland API"})
})

app.get('/.well-known/pki-validation/0465050F5283902A88B85B2E662EDF52.txt', (req, res)=>{
    res.sendFile("/Users/macbook/coffeelandbe/0465050F5283902A88B85B2E662EDF52.txt")
})

const httpsServer = https.createServer({key, cert}, app)
httpsServer.listen(8443)