const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require("../models/blacklist.model")



/***
 * @name registerUserController
 * @description register a new user, ex
 * @access public
 */

async function registerUserController(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"

        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: 'Account already exists with this email address or username'
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax'
    })

    res.status(201).json({
        message: "User registerd successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}



/**
 * @name loginuserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */


async function loginUserController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax'
    })
    res.status(200).json({
        message: "User loggedIn successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }
    res.clearCookie('token')

    res.status(200).json({
        message: "User logged out successfully."
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */

async function getMeController(req, res) {
    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(200).json({
                message: "No active session",
                user: null
            })
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })
        if (isTokenBlacklisted) {
            return res.status(200).json({
                message: "Session expired",
                user: null
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(200).json({
                message: "User not found",
                user: null
            })
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        return res.status(200).json({
            message: "Invalid session",
            user: null
        })
    }
}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}