'use strict';
const logger = require('./util/logger');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(router);

// main server error handler
app.use((/* Error */err, /* Request */req, /* Response*/ res, next) => {
  logger.warn(`Server error: ${err.message}`);
  const response = {
    'error_code': err.errorCode || 'SERVER_ERROR',
    'message': err.message,
  };
  return res.status(err.statusCode || 500).send(response);
});

module.exports = app;
