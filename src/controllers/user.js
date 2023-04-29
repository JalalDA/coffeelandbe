const { User } = require('../models/index')
const bcrypt = require('bcrypt')
const randomstring = require('randomstring')
const transporter = require('../config/transporter')
const client = require('../config/redis')
const jwt = require('jsonwebtoken')
const { v4: uuidV4 } = require("uuid")

const createUser = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body
        console.log({ body: req.body });
        const checkUser = await User.findOne({ where: { email } })
        if (checkUser) {
            return res.status(400).json({
                msg: "Email is already registered"
            })
        }
        if (!username) {
            return res.status(400).json({
                msg: "Please input a valid username"
            })
        }
        if (!email?.includes("@")) {
            return res.status(400).json({
                msg: "Please input a valid email"
            })
        }
        if (!password) {
            return res.status(400).json({
                msg: "Please input a valid password"
            })
        }
        if (!phone) {
            return res.status(400).json({
                msg: "Please input a valid phone"
            })
        }
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        const user = new User({
            user_id: uuidV4(),
            username,
            email,
            password: hashPassword,
            phoneNumber: phone,
            isActive: false
        })
        const result = await user.save()
        const code = randomstring.generate({
            capitalization: 'uppercase',
            charset: 'numeric',
            length: 6
        })
        if (result) {
            transporter.sendMail({
                from: 'coffeland',
                to: email,
                subject: 'Activate your account',
                text: `Input this code : ${code} to activate your account`
            })
            await client.set(`code-${email}`, code)
        }
        res.status(200).json({
            msg: "Register Success, please check your email to activate your account"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}

const activateAccount = async (req, res) => {
    try {
        const { code, email } = req.body
        const result = await client.get(`code-${email}`)
        if (code !== result) {
            return res.status(400).json({
                msg: "Please input a valid code",
            })
        } else {
            const user = await User.findOne({ where: { email: email } })
            if (!user) {
                return res.status(404).json({
                    msg: "User is not found, please check your email"
                })
            }
            await user.update({ isActive: true })
            const { user_id } = user
            const token = jwt.sign({ email, user_id }, process.env.JWT_SECRET_KEY, {
                expiresIn: '1d'
            })
            return res.status(200).json({
                msg: "Your account is active now!",
                token
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            return res.status(404).json({
                msg: `User with email ${email} is not registered`
            })
        }
        const isActive = user?.isActive
        if (!isActive) {
            return res.status(400).json({
                msg: "Your account is not active, please activate your account first"
            })
        }
        const hashedPassword = user?.password
        const match = await bcrypt.compare(password, hashedPassword)
        if (!match) {
            return res.status(400).json({
                msg: "Wrong email or password"
            })
        }
        const { user_id, photo } = user
        const token = jwt.sign({ email, user_id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d'
        })
        res.status(200).json({
            msg: "Login success",
            token,
            photo
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error })
    }
}

const updateUser = async (req, res) => {
    try {
        const { username, email, phoneNumber, address, dateofBirth, point, firstname, lastname, gender } = req.body
        const file = req.file
        const photo = file ? file.path.replace('public', '').replace(/\\/g, '/') : null;
        const { user_id } = req?.payload
        const user = await User.findOne({ where: { user_id: user_id } })
        console.log({ user });
        if (!user) {
            return res.status(404).json({
                msg: `User not found`
            })
        }
        console.log({
            body: req.body
        });
        await user.update({
            username: username || user?.username,
            email: email || user?.email,
            photo: photo || user?.photo,
            phoneNumber: phoneNumber || user?.phoneNumber,
            address: address || user?.address,
            dateofBirth: dateofBirth || user?.dateofBirth,
            point,
            firstname: firstname || user?.firstname,
            lastname: lastname || user?.lastname,
            gender: gender || user?.gender
        })
        await user.save()
        res.status(200).json({
            msg: "Success update user"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error })
    }
}

const getUserInfo = async (req, res) => {
    try {
        const { user_id } = req.payload
        console.log({ payload: req.payload });
        const user = await User.findOne({
            where: {
                user_id: user_id
            },
            attributes: {
                exclude: ['password']
            }
        })
        if (!user) {
            return res.status(404).json({
                msg: "User not found!"
            })
        }
        res.status(200).json({
            msg: "Success",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }
        const code = randomstring.generate({
            capitalization: 'uppercase',
            charset: 'numeric',
            length: 6
        })
        const result = transporter.sendMail({
            from: "Coffeeland",
            to: email,
            subject: "Forgot Password",
            text: `Please input this code ${code}to resest your password`
        })
        if (result) {
            await client.set(`forgot-${code}`, code)
            res.status(200).json({
                msg: "Success, please check your email to reset your password"
            })
        } else {
            res.status(500).json({
                msg: "Something wrong, please try again"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error })
    }
}

const checkForgotPass = async (req, res) => {
    try {
        const { email, code } = req.body
        const usercode = await client.get(`forgot-${email}`)
        if (usercode !== code) {
            return res.status(400).json({
                msg: "Please input a valid code"
            })
        } else {
            return res.status(200).json({
                msg: "Succes, now you can update your password"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}

const udpatePassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body
        const user = await User.findOne({ email })
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                msg: "New password and confirm password doesn't match!!"
            })
        }
        if (!user) {
            res.status(404).json({
                msg: "User not found"
            })
        }
        await user.update({ password: newPassword })
        return res.status(200).json({
            msg: "Success update your password",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}

const loginWithGoogle = async (req, res) => {
    try {
        const { email, name, photo } = req?.payload
        const exist = await User.findOne({ where: { email } })
        let token;
        if (exist) {
            token = jwt.sign({ email, user_id: exist?.user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
        } else {
            const user = new User({
                user_id : uuidV4(),
                username : name,
                email,
                password : `${name}123`,
                photo,
                isActive : false
            })
            await user.save()
            const createdUser = await User.findOne({where : {email}})
            token = jwt.sign({ email, user_id: createdUser?.user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
        }
        res.status(200).json({
            msg : "Success",
            token,
            photo
        })
    } catch (error) {
        console.log({ error });
        res.status(400).json({ error })
    }
}

module.exports = {
    createUser,
    activateAccount,
    login,
    updateUser,
    getUserInfo,
    forgotPassword,
    checkForgotPass,
    udpatePassword,
    loginWithGoogle
}