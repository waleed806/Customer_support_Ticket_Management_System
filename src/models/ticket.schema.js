const mongoose = require('mongoose')

const userTicket = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },

    description: {
        type: String,
        required: [true, "description is required"]
    },
       
    priority: {
        type: String,
        required: [true, "priority is required"],
        enum: ['LOW', 'MEDIUM', 'HIGH'],
    },

   status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'CLOSED'],
    default: 'OPEN'
    },

    createdBy:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'user',
       required: true
    }

},{timestamps: true})


const userTicketModel = mongoose.model('ticket', userTicket)
module.exports = userTicketModel