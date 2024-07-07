const JWT = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.SECRET;

function createTokenForUser(user) {
    const payload = {
        fullName : user.fullName,
        _id : user._id,
        email : user.email,
        profileImageURL : user.profileImageURL,
        role : user.role
    }
    const token = JWT.sign(payload,SECRET);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, SECRET);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}