const { Router } = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')

const authRouter = Router()


/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUserController)
/**
 * @route POST /api/auth/login
 * @description login user with password
 * @access Public
 */

authRouter.post("/login", authController.loginUserController)


/**
 * @route POST /api/auth/logout
 * @description clear token from user cookie and the token in blacklist
 * @ccess public
 */
authRouter.post("/logout", authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
*/

authRouter.get("/get-me", authController.getMeController)






module.exports = authRouter