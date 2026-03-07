const userModel = require('../model/user.model')
const blacklistModel = require('../model/blacklist.model')
const redis = require('../config/cache')
const jwt = require('jsonwebtoken')

async function authUser(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const isBlacklisted = await redis.get(token)

        if (isBlacklisted) {
            return res.status(401).json({
                message: "Token blacklisted"
            })
        }

        req.user = decoded
        next()

    } catch (err) {
        return res.status(401).json({
            message: "Token invalid"
        })
    }
}

module.exports = authUser