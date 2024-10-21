const jwt = require('jsonwebtoken');

// Use an environment variable for the JWT secret
const jwtSecret = process.env.JWT_SECRET || "defaultSecret"; // Use a default for development

const fetch = (req, res, next) => {
    // Get the user from the JWT token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: "Invalid Auth Token" });
    }

    try {
        const data = jwt.verify(token, jwtSecret);
        req.user = data.user; // Add user data to the request object
        next();
    } catch (error) {
        // Handle token expiration and invalid token
        return res.status(401).json({ error: "Invalid Auth Token" });
    }
};

module.exports = fetch;
