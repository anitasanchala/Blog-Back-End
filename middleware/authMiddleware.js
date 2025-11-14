
const env = require('dotenv');
const jwt = require('jsonwebtoken');
env.config();

function verifyToken(req, res, next) {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : "";
    if (!token) {
        return res.status(200).json({ status:400,mes: "No Token Provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(200).json({ status:401,mes: "Invalid Token Provided" });
        }
        req.user = decoded;
        next();
    });
}

module.exports = { verifyToken };