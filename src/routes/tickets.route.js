const express = require('express')
const {createTicket,HandleAllTicketsrequest, HandleSingleTicketsrequest, HandleEditTicketsrequest,HandleDeleteTicketsrequest } = require('../controllers/ticket.controller')
const {checkuserAuthentication} = require('../middleware/auth.middleware')
const ticketRouter = express.Router()


// middleware route and ticket generation
ticketRouter.post('/tickets',checkuserAuthentication ,createTicket)

ticketRouter.get('/tickets',checkuserAuthentication, HandleAllTicketsrequest)
ticketRouter.get('/tickets/:id',checkuserAuthentication, HandleSingleTicketsrequest)

ticketRouter.patch('/tickets/:id', checkuserAuthentication ,HandleEditTicketsrequest)
ticketRouter.delete('/tickets/:id', checkuserAuthentication, HandleDeleteTicketsrequest);


module.exports = ticketRouter