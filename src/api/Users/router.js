/* eslint-disable no-use-before-define */
const express = require('express');

const router = express();

const { USER_NOT_FOUND_ERROR } = require('../../config/error');
const { userDetailsSchema, userLoginSchema } = require('./userSchemaCheck');
const { handleUserLogin } = require('./Authentication');
const { getUserDetails } = require('./userDetails');
const { auth } = require('../middleware');
const logger = require('../../config/logger')(module);

router.post('/auth/login', async (req, res) => handleLogin(req, res));
router.post('/details', auth, async (req, res) => handleGetUserDetails(req, res));

const handleLogin = async (req, res) => {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
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
    {
        const { error } = userDetailsSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        try {
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
}

module.exports = router;
