const {Category} = require("../models/index")
const {v4 : uuidV4} = require("uuid")

const addCategory = async (req, res)=>{
    try {
        const {name} = req.body
        const category = new Category({
            category_id : uuidV4(),
            name,
        })
        await category.save()
        res.status(200).json({
            msg : "Success add category",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({error})
    }
}

const getAllCategory = async (req, res)=>{
    try {
        const category = await Category.findAll()
        res.status(200).json({category})
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
}

module.exports = {
    addCategory,
    getAllCategory
}