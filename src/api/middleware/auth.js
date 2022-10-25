const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/keys');
const logger = require('../../config/logger')(module);

module.exports = (req, res, next) => {
    const token = req.header('authorization');

    if (!token) return res.status(401).send({ status: "Unauthorized!", message: 'Access Denied!' });
    try {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        const verified = jwt.verify(bearerToken, JWT_SECRET);
        logger.info(`User Login JWT Token : ${verified}`);
        req.token = bearerToken;
        // eslint-disable-next-line no-underscore-dangle
        req.user = verified._user;
        return next();
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
};
