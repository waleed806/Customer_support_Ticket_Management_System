const jwt = require('jsonwebtoken')
const config = require('../config/config')

function CreateJWTToken(user){
  const payload = {
    id : user._id,
    role: user.role
  }

  const token = jwt.sign(payload, config.JWT_SECRET)
  return token
}

function ValidateJWTToken(token){
    const isvalid = jwt.verify(token, config.JWT_SECRET)
    return isvalid
}

module.exports = {CreateJWTToken, ValidateJWTToken}