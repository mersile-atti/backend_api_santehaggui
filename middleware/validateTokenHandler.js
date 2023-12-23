// validateToken.js
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { getSecret } = require('../config/getSecret');

const validateToken = asyncHandler(async (req, res, next) => {
    try {
        const secretValue = await getSecret();
        const { ACCESS_TOKEN_SECRET } = JSON.parse(secretValue);

        let token;
        let authHeader = req.headers.Authorization || req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];

            jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    res.status(401);
                    throw new Error('User is not authorized');
                }
                req.user = decoded.user;
                next();
            });

            if (!token) {
                res.status(401);
                throw new Error('User is not authorized or token is missing');
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = validateToken;
