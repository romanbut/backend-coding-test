'use strict';

const port = 8010;
const logger = require('./src/util/logger');
const db = require('./src/util/db');

const buildSchemas = require('./src/schemas');
const app = require('./src/app');

(async ()=> {
  await buildSchemas(db);

  const server = app(db);

  server.listen(port, () => logger.info(`App started and listening on port ${port}`));
})();
