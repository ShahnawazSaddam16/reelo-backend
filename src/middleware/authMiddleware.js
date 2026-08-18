const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    try {
        // Accept token from Authorization header, cookie, or query param
        const authHeader = req.headers.authorization || req.headers.Authorization;
        let token;

        if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (req.query && req.query.token) {
            token = req.query.token;
        }

        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // Remove surrounding quotes if present and trim
        token = token.toString().trim().replace(/^\"|\"$/g, "").replace(/^\'|\'$/g, "");

        // Quick format validation: JWTs have three parts separated by dots
        if (token.split('.').length !== 3) {
            console.error('Invalid token format');
            return res.status(401).json({ success: false, message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;