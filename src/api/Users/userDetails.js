const express = require('express');
const { USER_NOT_FOUND_ERROR } = require('../../config/error');
const { db } = require('../middleware/firebase');
const { UserConverter } = require('./User');
// const { auth } = require('../middleware');
const { userDetailsSchema } = require('./userSchemaCheck');

const router = express();
const logger = require('../../config/logger')(module);


/**
 * @swagger
 * /api/user/details:
 *   get:
 *      tags:
 *          - user
 *      description: To get all the users of the user
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: authorization
 *         description: auth token got from  login.
 *         in: header
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdXNlciI6eyJvcmRlcnMiOlsiMSJdLCJfaWQiOiI2MDQ1YTQ2OGU4YTljZTRlNTQzZGFmN2IiLCJpZCI6MSwibmFtZSI6ImpheXZpc2hhYWxqIiwicGhubyI6NzM1ODEyNTE1MSwiZW1haWwiOiJqYXlAam1haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkZHRvZkZqaWJndm83V1ZOS2JnM1dTT25WN1VlSkJla3l2QS40bWMwMC9nU2RtbXYwWmxTZXEiLCJnZW5kZXIiOiJtYWxlIiwiZG9iIjoiMTQtMDQtMjAwMCIsInZlcmlmaWVkIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDIxLTAzLTA4VDA0OjEzOjI4LjUzM1oiLCJ1cGRhdGVkQXQiOiIyMDIxLTA0LTEyVDE1OjAxOjIxLjUyM1oiLCJfX3YiOjB9LCJpYXQiOjE2MTg2NDM4Nzh9.MCnAsFzEFTMo1xCfHrsWJsRg-f0UrTGHqw8kRgq-wzU
 *         type: string
 *      responses:
 *          200:
 *             description: All the orders will be returned
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *                              example: OTP Sent to regsitered mobile number
 *          201:
 *             description: User Already Exists but needs to be verified before ordering
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *          400:
 *             description: Error Occured due to bad request cause of validation
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *          500:
 *             description: Error Occured in the server while processing the request
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *
 */

router.post('/', async (req, res) => {
    const { error } = userDetailsSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const snapshot = await db.collection('users').where("email_id", "==", req.body.email).withConverter(UserConverter).get();
        const result = [];
        snapshot.forEach((doc) => {
            if (doc.exists) {
                result.push(doc.data());
            }
            logger.info(`${result.email_id} => ${result}`);
        });
        if (result.length > 0) {
            return res.status(200).json(result[0]);
        }
        throw new Error(USER_NOT_FOUND_ERROR)
    } catch (err) {
        if (err === new Error(USER_NOT_FOUND_ERROR)) {
            return res.status(400).json({ message: "User Doesn't exist" });
        }
        logger.error(`Error occured while trying to access user details for user req : ${JSON.stringify(req.body)}, err: ${JSON.stringify(err)}`)
        return res.status(500).json({ message: 'Oops! Sorry Some Error Occured Please Try Again Latter' });

    }

});

module.exports = router;
