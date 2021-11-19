'use strict';

const port = 8010;
const logger = require('./src/util/logger');
const db = require('./src/db/db');

const app = require('./src/app');

db.init().
    then(() => {
      app.listen(port, ()=>logger.info(`App started and listening on port ${port}`));
    }).
    catch((/* Error */ error) => logger.error(`Failed to initialize database. ${error.message}`));
