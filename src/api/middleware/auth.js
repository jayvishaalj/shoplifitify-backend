const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/keys');
const logger = require('../../config/logger')(module);

module.exports = (req, res, next) => {
    const token = req.header('authorization');

    if (!token) return res.status(401).send('Access Denied!');
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        logger.info(`User Login JWT Token : ${verified}`);
        // eslint-disable-next-line no-underscore-dangle
        req.user = verified._user;
        return next();
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
};
