const userTicketModel = require('../models/ticket.schema')
const mongoose = require('mongoose')


// CREATE TICKET
async function createTicket(request, response) {
    try {
        const { title, description, priority } = request.body;

        if (!title || !description || !priority) {
            return response.status(400).json({
                message: "All fields are required"
            });
        }

        if (title.length < 8 || title.length > 100) {
            return response.status(400).json({
                message: "Title must be between 8 and 100 characters"
            });
        }

        if (description.length < 10 || description.length > 2000) {
            return response.status(400).json({
                message: "Description must be between 10 and 2000 characters"
            });
        }

        const isAllowedPriority = ['LOW', 'MEDIUM', 'HIGH'];

        if (!isAllowedPriority.includes(priority)) {
            return response.status(400).json({
                message: "Invalid priority"
            });
        }

        const ticket = await userTicketModel.create({
            title,
            description,
            priority,
            createdBy: request.user.id
        });

        return response.status(201).json({
            message: "Ticket raised successfully",
            ticket
        });

    } catch (error) {
        return response.status(500).json({
            message: "Internal server error"
        });
    }
}


//GET ALL USER TICKETS
async function HandleAllTicketsrequest(request, response) {
    try {
        const tickets = await userTicketModel.find({
            createdBy: request.user.id
        });

        if (!tickets.length) {
            return response.status(200).json({
                message: "No tickets found",
                tickets: []
            });
        }

        return response.status(200).json({
            result: tickets
        });

    } catch (error) {
        return response.status(500).json({
            message: "Internal server error"
        });
    }
}


// GET SINGLE TICKET
async function HandleSingleTicketsrequest(request, response) {
    try {
        const id = request.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Invalid ticket ID"
            });
        }

        const ticket = await userTicketModel.findOne({
            _id: id,
            createdBy: request.user.id
        });

        if (!ticket) {
            return response.status(404).json({
                message: "Ticket not found"
            });
        }

        return response.status(200).json({
            result: ticket
        });

    } catch (error) {
        return response.status(500).json({
            message: "Internal server error"
        });
    }
}


// EDIT TICKET
async function HandleEditTicketsrequest(request, response) {
    try {
        const id = request.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Invalid ticket ID"
            });
        }

        const { title, description, priority } = request.body;

        if (title !== undefined && (typeof title !== 'string' || title.length < 8 || title.length > 100)) {
            return response.status(400).json({
                message: "Title must be between 8 and 100 characters"
            });
        }

        if (description !== undefined && (typeof description !== 'string' || description.length < 10 || description.length > 2000)) {
            return response.status(400).json({
                message: "Description must be between 10 and 2000 characters"
            });
        }

        if (priority !== undefined && !['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
            return response.status(400).json({
                message: "Invalid priority"
            });
        }

        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (priority !== undefined) updateData.priority = priority;

        if (Object.keys(updateData).length === 0) {
            return response.status(400).json({
                message: "Provide at least one field to update"
            });
        }

        const ticket = await userTicketModel.findOneAndUpdate(
            {
                _id: id,
                createdBy: request.user.id
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!ticket) {
            return response.status(404).json({
                message: "Ticket not found"
            });
        }

        return response.status(200).json({
            message: "Ticket updated successfully",
            ticket
        });

    } catch (error) {
        return response.status(500).json({
            message: "Internal server error"
        });
    }
}


// DELETE TICKET
async function HandleDeleteTicketsrequest(request, response) {
    try {
        const id = request.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Invalid ticket ID"
            });
        }

        const ticket = await userTicketModel.findOneAndDelete({
            _id: id,
            createdBy: request.user.id
        });

        if (!ticket) {
            return response.status(404).json({
                message: "Ticket not found"
            });
        }

        return response.status(200).json({
            message: "Ticket deleted successfully",
            ticket
        });

    } catch (error) {
        return response.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    createTicket,
    HandleAllTicketsrequest,

    HandleSingleTicketsrequest,
    HandleEditTicketsrequest,
    HandleDeleteTicketsrequest
}