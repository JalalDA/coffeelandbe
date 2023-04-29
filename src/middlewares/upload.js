const multer = require("multer")
const path = require("path")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const cloudinary = require("cloudinary").v2

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'coffeeland'
    }
})

const limit = {
    fileSize : 3e6
}

const imageOnlyFilter = (req, file, cb)=>{
    const extName = path.extname(file.originalname)
    const allowedExt = /jpg|png|jpeg/
    if(!allowedExt.test(extName))
    return cb(new Error("Please insert jpg or png only"), false)
    cb(null, true)
}


const upload = multer({
    storage : storage,
    limits : limit,
    fileFilter : imageOnlyFilter
})


module.exports = upload