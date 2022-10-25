const jwt = require('jsonwebtoken');
const { EXPIRES_IN } = require('../../config/config');
const { USER_NOT_FOUND_ERROR } = require('../../config/error');
const { JWT_SECRET } = require('../../config/keys');
const { db } = require('../middleware/firebase');
const { UserConverter } = require('./User');
const logger = require('../../config/logger')(module);


module.exports.handleUserLogin = async (req) => {
    const snapshot = await db.collection('users').where("email_id", "==", req.body.email).where("password", "==", req.body.password).withConverter(UserConverter).get();
    const result = [];
    snapshot.forEach((doc) => {
        if (doc.exists) {
            result.push(doc.data());
        }
        logger.info(`${result.email_id} => ${result}`);
    });
    if (result.length > 0) {
        const token = jwt.sign({ _user: result[0] }, JWT_SECRET, {
            expiresIn: EXPIRES_IN
        });
        logger.log('info', `USER Login API CONTROLLER  ${JSON.stringify(result)} , token: ${token}`);
        return [null, token]
    }
    throw new Error(USER_NOT_FOUND_ERROR)
}
