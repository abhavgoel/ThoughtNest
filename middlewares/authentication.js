const { validateToken } = require("../utils/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req,res,next) => {
        const tokenCookie = req.cookies[cookieName];
        
        if(!tokenCookie) { 
            return next();
        }
        try {
            const userPayload = validateToken(tokenCookie);
            req.user = userPayload;

        } catch(error) {}
        next();
    }
}

module.exports = {
    checkForAuthenticationCookie,

}