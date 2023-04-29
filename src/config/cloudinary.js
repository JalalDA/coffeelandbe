const cloudinary = require("cloudinary").v2

const cloudinaryConfig = (req, res, next)=>{
    cloudinary.config({
        cloud_name : "self-employe",
        api_key : "725925212315555",
        api_secret : "x66K-Se50VJPDP8ZKLFQkGvkFfY"

    })
    next()
}

module.exports = cloudinaryConfig