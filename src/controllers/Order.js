const { Order, OrderItem, User } = require("../models/index")
const { v4: uuidV4 } = require('uuid')

const addOrder = async (req, res) => {
    try {
        const {
            user_id,
            items,
            total,
            paymentMethod
        } = req.body
        const order = new Order({
            order_id: uuidV4(),
            user_id,
            total,
            paymentMethod
        })
        await order.save()
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            await OrderItem.create({
                order_item_id: uuidV4(),
                quantity: item?.quantity,
                price: item?.price,
                product_id: item?.product_id,
                order_id: order?.order_id
            })
        }
        const updatedOrder = await Order.findByPk(order?.order_id, {
            include: {
                model: OrderItem
            }
        })
        res.status(200).json({
            msg: "Success create order",
            updatedOrder
        })
    } catch (error) {
        console.log({ error });
        res.status(400).json({ error })
    }
}

const getSingleOrder = async (req, res)=>{
    try {
        const {id} = req.params
        console.log(req.params);
        const order = await Order.findByPk(id, {include : [{model : OrderItem}, {model : User}]})
        res.status(200).json({
            msg : `Show order with id ${id}`,
            order
        })
    } catch (error) {
        console.log({error});
        res.status(400).json({error})
    }
}

const getAllOrder = async (req, res) => {
    try {
        const { limit, page } = req.body
        const orders = await Order.findAndCountAll({
            offset: limit * (page - 1),
            limit,
            include: [
                {
                    model: OrderItem
                },
                {
                    model : User
                }
            ]
        })
        res.status(200).json({
            data: orders.rows,
            total: orders.count
        })
    } catch (error) {
        console.log({ error });
        res.status(400).json({ error })
    }
}

module.exports = {
    addOrder,
    getAllOrder,
    getSingleOrder
}