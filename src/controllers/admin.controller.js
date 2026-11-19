const userTicketModel = require('../models/ticket.schema');

async function admin(request, response) {
    try {
        const usersData = await userTicketModel.find()
            .populate('createdBy', 'username email');

            if (!usersData.length) {
            return response.status(200).json({
                message: "No tickets found",
                tickets: []
            });
        }

        return response.status(200).json({ usersData });

    } catch (error) {
        return response.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports = admin;