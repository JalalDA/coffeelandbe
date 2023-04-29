const { Op } = require("sequelize");
const { Product, Category } = require("../models/index")
const { v4: uuidV4 } = require("uuid")

const addProduct = async (req, res) => {
    try {
        const file = req.file
        const image = file ? file.path.replace('public', '').replace(/\\/g, '/') : null;
        const { category_id, name, description, price, quantity } = req.body
        console.log({ name });
        const product = new Product({
            product_id: uuidV4(),
            name,
            description,
            price,
            quantity,
            image,
            category_id
        })
        await product.save()
        res.status(200).json({
            msg: "Success create product"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}

const getProduct = async (req, res) => {
    try {
        const { product_id } = req.params
        const product = await Product.findByPk(product_id, {
            include: [{
                model: Category,
                // as : "category_id"
            }]
        })
        if (!product) {
            return res.status(404).json({
                msg: "Product not found"
            })
        }
        res.status(200).json({
            product
        })
    } catch (error) {
        console.log({ error });
        res.status(500).json({ error })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const { page = 1, category_id, sort = "DESC", limit = 5, search = "" } = req.body
        console.log({ category_id });
        let products;

        if (category_id) {
            products = await Product.findAndCountAll({
                where: {
                    name: {
                        [Op.like]: `%${search}%`
                    },
                    category_id: category_id
                },
                offset: limit * (page - 1),
                limit: limit,
                order : [['createdAt', 'ASC']],
                include: [
                    {
                        model: Category
                    }
                ]
            })
        }else{
            products = await Product.findAndCountAll({
                where: {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                },
                offset: limit * (page - 1),
                limit: limit,
                order : [['createdAt', 'ASC']],
                include: [
                    {
                        model: Category
                    }
                ]
            })
        }
        res.status(200).json({
            data : products?.rows,
            total : products?.count,
            page,
            limit,
            totalPage : Math.ceil(products?.count / limit)
        })
    } catch (error) {
        if(error === "Please insert jpg or png only"){
            return res.status(400).json({
                error
            })
        }
        console.log({ error });
        res.status(400).json({ error })
    }
}

const updateProduct = async (req, res) => {
    try {
        const file = req.file
        const image = file ? file.path.replace('public', '').replace(/\\/g, '/') : null;
        const {product_id, category_id, name, description, price, quantity } = req.body
        const product = await Product.findOne({ product_id : product_id })
        console.log({product_id});
        if (!product) {
            return res.status(404).json({
                msg: "Product not found"
            })
        }
        if(image){
            await product.update({
                image
            })
        }
        await product.update({
            category_id,
            name,
            description, price,
            quantity
        })
        res.status(200).json({
            msg: "Success update product"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}

const deleteProduct = async (req, res)=>{
    try {
        const {product_id} = req.body
        const product = await Product.findOne({where : {product_id : product_id}})
        await product.update({
            deleted_at : new Date(Date.now())
        })
        res.status(200).json({
            msg : "Success delete product",
            product : product.dataValues
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({error})
    }
}

module.exports = {
    addProduct,
    updateProduct,
    getProduct,
    getAllProduct,
    deleteProduct
}