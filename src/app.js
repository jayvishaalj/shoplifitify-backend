const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const apiRouter = require('./api/routes/index');

const wLogger = require("./config/logger")(module);

const errorHandler = require('./api/middleware/errorHandler');

const app = express();

app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


/**
 * Swagger Docs Configuration
 */
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: 'v1.0.0',
      title: 'Shopliftify API DOCS',
      description: 'Documentation for APIs used in the Shopliftify app.',
      contact: {
        name: 'Jay Vishaal J',
      },
    },
  },
  apis: ['./api/**/*.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(
  '/api-doc',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: false,
    customSiteTitle: 'Appeatite',
    customCss: '.swagger-ui .topbar {display:none}',
  })
);


/**
* Directing to the routers
*/
app.use('/api', apiRouter);

/**
* Error Handling Routes
*/

// catch 404 and forward to error handler
app.use((req, res, next) => {
  wLogger.error(`Error Url Not Found ${req.url}`);
  next(createError.NotFound());
});


app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// pass any unhandled errors to the error handler
app.use(errorHandler);

module.exports = app;
