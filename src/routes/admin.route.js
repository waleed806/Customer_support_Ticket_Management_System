const express = require('express')
const adminRouter = express.Router()
const {checkuserAuthentication} = require('../middleware/auth.middleware')
const checkAdminValidation = require('../middleware/admin.authorization.middleware')
const admin = require('../controllers/admin.controller')

adminRouter.get('/admin/tickets', checkuserAuthentication, checkAdminValidation(['ADMIN']), admin)

module.exports = adminRouter