const mongoose = require('mongoose')
const config = require('./config')

async function ConnectToMongoose() {
    try {
        await mongoose.connect(config.MONGO_URL)
        console.log('Mongo Connected');
    } catch (error) {
        console.log("Database connection failed");
        throw error
    }
}

module.exports = ConnectToMongoose