const express = require('express');

const router = express();

const indexRouter = require('./userDetails');

router.use('/details', indexRouter);

module.exports = router;
