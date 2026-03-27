const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')


function extractToken(req) {
    const cookieToken = req.cookies?.token
    if (cookieToken) {
        return cookieToken
    }

    const authHeader = req.headers?.authorization
    if (typeof authHeader === 'string' && authHeader.trim()) {
        const trimmedAuth = authHeader.trim()
        if (/^Bearer\s+/i.test(trimmedAuth)) {
            return trimmedAuth.replace(/^Bearer\s+/i, '').trim()
        }
        return trimmedAuth
    }

    const xAccessToken = req.headers?.['x-access-token']
    if (typeof xAccessToken === 'string' && xAccessToken.trim()) {
        return xAccessToken.trim()
    }

    const tokenHeader = req.headers?.token
    if (typeof tokenHeader === 'string' && tokenHeader.trim()) {
        return tokenHeader.trim()
    }

    const queryToken = req.query?.token
    if (typeof queryToken === 'string' && queryToken.trim()) {
        return queryToken.trim()
    }

    const bodyToken = req.body?.token
    if (typeof bodyToken === 'string' && bodyToken.trim()) {
        return bodyToken.trim()
    }

    return null
}


async function authUser(req, res, next) {
    const token = extractToken(req)

    if (!token) {
        return res.status(401).json({
            message: 'Token not Provided'
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token."
        })
    }

}

module.exports = { authUser }