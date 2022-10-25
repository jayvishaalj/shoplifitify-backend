const { USER_NOT_FOUND_ERROR } = require('../../config/error');
const { db } = require('../middleware/firebase');
const { UserConverter } = require('./User');
const logger = require('../../config/logger')(module);

module.exports.getUserDetails = async (req) => {
    const snapshot = await db.collection('users').where("email_id", "==", req.body.email).withConverter(UserConverter).get();
    const result = [];
    snapshot.forEach((doc) => {
        if (doc.exists) {
            result.push(doc.data());
        }
        logger.info(`${result.email_id} => ${result}`);
    });
    if (result.length > 0) {
        return result[0];
    }
    throw new Error(USER_NOT_FOUND_ERROR)

};
