const dotenv = require('dotenv');
dotenv.config()

if(!process.env.MONGO_URL){
    throw new Error("MONGO_URL not available in env");
    
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET not available in env");
    
}

const config = {
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET
}

module.exports = config