const express = require('express')
const authRouter = express.Router()
const { handleSignUpPOSTPage, handleSignInPOSTPage} = require('../controllers/auth.controller')



// authentication routes
authRouter.post('/signup', handleSignUpPOSTPage)
authRouter.post('/login', handleSignInPOSTPage)


module.exports = authRouter