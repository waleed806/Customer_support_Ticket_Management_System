function checkAdminValidation(allowedRole){
    return function (request, response, next){
    if (!request.user) {
             response.status(401).json({
                message: "Please login first"
            });
            
        }

         if (!allowedRole.includes(request.user.role)) {
            return response.status(403).json({
                message: "Access forbidden"
            });
        }

        next();
}
}

module.exports = checkAdminValidation