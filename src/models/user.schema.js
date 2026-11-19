const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: [true, 'username must be unique']
    },

    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email must be unique']
    },

    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },

    password: {
        type: String,
        required: [true, 'password is required']
    },
},{timestamps: true})

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return
    const plainPassword = this.password
    const hashedPassword = await bcrypt.hash(plainPassword, 10)
    this.password = hashedPassword

})


const userModel = mongoose.model('user', userSchema)
module.exports = userModel