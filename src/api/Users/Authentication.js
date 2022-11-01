const jwt = require('jsonwebtoken');
const { EXPIRES_IN } = require('../../config/config');
const { USER_NOT_FOUND_ERROR, USER_EMAIL_ALREADY_REGISTERED } = require('../../config/error');
const { JWT_SECRET } = require('../../config/keys');
const { db } = require('../middleware/firebase');
const { UserConverter } = require('./User');
const { createShopifyDevStore } = require('../helpers')
const logger = require('../../config/logger')(module);


// service and Dao layer
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

module.exports.handleUserRegister = async (req) => {
    const user = UserConverter.toUserObject(req);
    user.photo_url = "avatar_default.jpg"
    user.role = "CEO"
    const snapshot = await db.collection('users').doc(user.email_id).withConverter(UserConverter).get();
    if (snapshot.exists) {
        throw new Error(USER_EMAIL_ALREADY_REGISTERED)
    }
    // const usersRef = db.collection('users');
    // const resultant = await usersRef.doc(user.email_id).withConverter(UserConverter).set(user);
    // async call that happens in the background thread
    createShopifyDevStore(user);
    // responding to the Req that the user creation is successful and Store Creation Initiated
    // return [null, resultant];
    return [null, null]
}
