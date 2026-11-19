const userModel = require('../models/user.schema')
const validator = require('validator');
const bcrypt = require('bcryptjs');
const {CreateJWTToken, ValidateJWTToken} = require('../services/auth.jwt')


async function handleSignUpPOSTPage(request, response) {
    try {
        const {username, email, password} = request.body

    if(!username || !email || !password){
        return response.status(400).json({
                message: "All fields are required"
            });
    }

    if (password.length < 8 || password.length > 72) {
    return response.status(400).json({
        message: "Password must be between 8 and 72 characters"
    });
}

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedUsername.length < 3 || normalizedUsername.length > 20) {
    return response.status(400).json({
        message: "Username must be between 3 and 20 characters"
    });
}



    if (!validator.isEmail(normalizedEmail)) {
        return response.status(400).json({
            message: "Invalid email address"
        });
    }
    
    const isAlreadyResgistered = await userModel.findOne({
        $or: [
            {username: normalizedUsername}, {email: normalizedEmail}
        ]
    })
 
    if(isAlreadyResgistered){
        return response.status(409).json({message: "username or email already exists"})
    }


    const user = await userModel.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password: password
    })
        
    const token = CreateJWTToken(user)
    response.cookie("token", token,{
         httpOnly: true,
         sameSite: "strict"
    })

    response.status(201).json({message: "user created", 
        user: {
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
    } catch (error) {
      throw error  
    }
}

async function handleSignInPOSTPage(request, response) {
  
    try {
        const {email, password} = request.body
        // const user_cookie = request.cookies

  if(!email || !password){
        return response.status(400).json({
                message: "All fields are required"
            });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const findedUser = await userModel.findOne({email: normalizedEmail})

    if(!findedUser){
        return response.status(404).json({message: "user not found"})
    }
    
    const isMatch = await bcrypt.compare(password, findedUser.password)
    if(!isMatch){
        return response.status(401).json({message: "username or password not valid"})
    }

        const token = CreateJWTToken(findedUser);

        response.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict'
        });

    response.status(201).json({message: "login successfull"})
    } catch (error) {
       throw error   
    }

}

module.exports = { handleSignUpPOSTPage,handleSignInPOSTPage}