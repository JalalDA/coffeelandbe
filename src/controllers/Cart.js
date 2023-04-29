const {Cart, CartItem} = require("../models/index")
const {v4 : uuidV4} = require('uuid')


const addCart = async (req, res)=>{
    try {
        const {user_id, total, items} = req.body
        const isExistCart = await Cart.findOne({user_id})
        let cart;
        if(!isExistCart){
            cart = new Cart({
                cart_id : uuidV4(),
                user_id,
                total
            })
            await cart.save()
        }else{
            cart = await Cart.findOne({user_id})
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            await CartItem.create({
                cart_item_id: uuidV4(),
                quantity: item?.quantity,
                price: item?.price,
                product_id: item?.product_id,
                cart_id: cart?.cart_id
            })
        }
        const updatedCart = await Cart.findByPk(cart?.cart_id)
        res.status(200).json({
            msg : "Success add to cart",
            updatedCart
        })
    } catch (error) {
        console.log({error});
        res.status(400).json({error})
    }
}

const getCartByUserId = async (req, res)=>{
    try {
        const {user_id, page, limit} = req.body
        const cart = await Cart.findAndCountAll({
            where : {
                user_id
            },
            offset : limit * (page - 1),
            limit,
            include : [
                {
                    model : CartItem
                }
            ]
        })
        res.status(200).json({
            data : cart.rows,
            total : cart.count
        })
    } catch (error) {
        console.log({error});
        res.status(400).json({error})
    }
}

module.exports = {
    addCart,
    getCartByUserId
}