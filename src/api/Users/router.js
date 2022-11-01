/* eslint-disable no-use-before-define */
const express = require('express');

const router = express();

const { USER_NOT_FOUND_ERROR, USER_UN_AUTHORIZED_ACTION, USER_EMAIL_ALREADY_REGISTERED } = require('../../config/error');
const { userDetailsSchema, userLoginSchema, userRegisterSchema } = require('./userSchemaCheck');
const { handleUserLogin, handleUserRegister } = require('./Authentication');
const { getUserDetails } = require('./userDetails');
const { auth } = require('../middleware');
const logger = require('../../config/logger')(module);

// Handler Layer
router.post('/auth/login', async (req, res) => handleLogin(req, res));
router.post('/auth/register', async (req, res) => handleNewUserRegister(req, res));
router.post('/details', auth, async (req, res) => handleGetUserDetails(req, res));


// Handler Functions
const handleLogin = async (req, res) => {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        // call to service Layer
        const [err, token] = await handleUserLogin(req);
        if (err !== null) {
            throw new Error(err)
        }
        return res.status(200).json({
            token,
            message: "Succesfully Logged In!"
        });
    } catch (err) {
        if (err.message === USER_NOT_FOUND_ERROR) {
            return res.status(201).json({ message: "Wrong Credentials! or User Doesn't exist!" });
        }
        logger.error(`Error occured while trying to access user details for user req : ${JSON.stringify(req.body)}, err: ${JSON.stringify(err)}`)
        return res.status(500).json({ message: 'Oops! Sorry Some Error Occured Please Try Again Latter' });
    }
}


const handleGetUserDetails = async (req, res) => {
    const { error } = userDetailsSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        if (req.user.email_id !== req.body.email) {
            return res.status(403).json({ message: USER_UN_AUTHORIZED_ACTION })
        }
        const user = await getUserDetails(req);
        return res.status(200).json({ user });
    } catch (err) {
        if (err === new Error(USER_NOT_FOUND_ERROR)) {
            return res.status(400).json({ message: "User Doesn't exist" });
        }
        logger.error(`Error occured while trying to access user details for user req : ${JSON.stringify(req.body)}, err: ${JSON.stringify(err)}`)
        return res.status(500).json({ message: 'Oops! Sorry Some Error Occured Please Try Again Latter' });
    }
}

const handleNewUserRegister = async (req, res) => {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        // call to service Layer
        const [err, result] = await handleUserRegister(req.body);
        if (err !== null) {
            throw new Error(err)
        }
        return res.status(200).json({
            result,
            message: "Succesfully Registered!"
        });
    } catch (err) {
        if (err.message === USER_EMAIL_ALREADY_REGISTERED) {
            return res.status(201).json({ message: USER_EMAIL_ALREADY_REGISTERED });
        }
        logger.error(`Error occured while trying to access user details for user req : ${JSON.stringify(req.body)}, err: ${JSON.stringify(err)}`)
        return res.status(500).json({ message: 'Oops! Sorry Some Error Occured Please Try Again Latter' });
    }
}

module.exports = router;
