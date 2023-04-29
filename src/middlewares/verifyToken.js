const jwt = require("jsonwebtoken")


const verifyToken = async (req, res, next)=>{
    try {
        const bearerToken = req.header("Authorization")
        console.log({bearerToken});
        if(!bearerToken){
            return res.status(401).json({
                msg : "Unauthorized"
            })
        }
        const clientToken = bearerToken.split(" ")[1]
        jwt.verify(clientToken, process.env.JWT_SECRET_KEY, async (err, payload)=>{
            console.log({payload});
            if(err && err.name === "TokenExpiredError"){
                return res.status(403).json({
                    msg : "Your token is expired, please login again"
                })
            }
            req.payload = payload
            next()
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({error})
    }
}

module.exports = verifyToken