const {verify}   = require('jsonwebtoken');
const adminvalidate = (req, res, next) => {
    const accessToken = req.header('accessToken');

    if (!accessToken) {
        return res.status(401).json({ error: 'Access token is missing' });
    }

    try {
        // Use environment variable for the secret key
        const secretKey =  "hey"

        // Verify the access token
        const decodedToken = verify(accessToken, secretKey);
        req.user = decodedToken;
        

        if (decodedToken) {
            // Attach the decoded token to the request for later use
            // req.decodedToken = decodedToken;
            return next();
        }
    } catch (err) {
        return res.status(403).json({ error: 'Invalid access token' });
    }
};

module.exports = adminvalidate