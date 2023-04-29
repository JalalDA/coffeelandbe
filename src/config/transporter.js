const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host : 'localhost',
    service : 'gmail',
    port : 587,
    secure : true,
    auth : {
        user : process.env.NODEMAILER_USER,
        pass : process.env.NODEMAILER_PASS
    }
})

module.exports = transporter