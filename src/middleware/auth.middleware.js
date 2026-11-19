const {ValidateJWTToken} = require('../services/auth.jwt')

function checkuserAuthentication(request, response, next) {
    const token = request.cookies?.token;

    if (!token) {
        return response.status(401).json({
            message: "Token not found. Kindly login."
        });
    }

    try {
        const isvalid = ValidateJWTToken(token);

        request.user = isvalid;

        next();

    } catch (error) {
        return response.status(401).json({
            message: "Unauthorized. Kindly login."
        });
    }
}

module.exports = { checkuserAuthentication }
