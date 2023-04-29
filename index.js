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
// const {User, Product, Category, Order, OrderItem} = require('./src/models/index')
const cloudinaryConfig = require('./src/config/cloudinary')

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
client.connect()
    .then(() => {
        console.log(`Redis connected`)
    })
    .catch((err) => {
        console.log({ err });
    })
app.use(cors({
    origin: ['*', 'http://localhost:3000', 'https://coffeelands-app.netlify.app'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cloudinaryConfig)
app.use(router)
app.listen(port, () => {
    console.log(`App listen on port ${port}`);
})