const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
    return (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                return res.status(401).json({ message: "No authorization header" });
            }
            if (!authorization.startsWith('bearer ')) {
                return res.status(401).json({ message: "Invalid authorization header" });
            }
            jwt.verify(authorization.split(' ')[1], process.env.SECRETKEY, (error, payload) => {
                if(error) {
                    return res.status(401).json({message: "Invalid token"});
                }
                if (roles.includes(payload.role)) {
                    next();
                } else {
                    return res.status(401).json({ message: "Unauthorized request" });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "server side error" });
        }
    }
}
