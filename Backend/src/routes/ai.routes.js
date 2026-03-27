const { Router } = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const aiController = require('../controllers/ai.controller')

const aiRouter = Router()

aiRouter.post('/generate-report', authMiddleware.authUser, aiController.generateInterviewReportController)

module.exports = aiRouter
