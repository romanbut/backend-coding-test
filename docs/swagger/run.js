'use strict';
const PORT = process.env.DOC_PORT || 8020;
const express = require('express');
const swagger = require('swagger-ui-express');
const docs = require('./docs');

const app = express();
app.use('/', swagger.serve, swagger.setup(docs));

app.listen(PORT);
console.log(`Docs server up and running on port ${PORT}`);
