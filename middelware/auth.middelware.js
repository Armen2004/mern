const config = require('config');
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; //"Bearer Token"
        if (!token) {
            return res.status(401).json({message: 'Not authorized!'});
        }
        req.user = jwt.verify(token, config.get('jwtSecret'));
        next();
    } catch (e) {
        res.status(401).json({message: 'Not authorized!'});
    }
}