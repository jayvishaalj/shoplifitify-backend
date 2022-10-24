const express = require('express');
const userRouter = require('../Users/router');

const router = express.Router();
const logger = require('../../config/logger')(module);


router.use('/user', userRouter);

/**
 * @swagger
 * /api:
 *   get:
 *      tags:
 *          - base
 *      description: Returns the base  url
 *      responses:
 *          200:
 *             description: A json containing a message
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 */
router.get('/', (req, res) => {
  logger.info("Hello World!");
  res.status(200).json({ message: 'BASE URL' });
});

module.exports = router;
