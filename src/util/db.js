'use strict';
const logger = require('./logger');
const Promise = require('bluebird');
const sqlite = require('sqlite3').verbose();

const database = new sqlite.Database(':memory:', (/* Error */err) => {
  if (err) {
    logger.error(`DB init failed. Reason: ${err.message}`);
  }
});
const db = Promise.promisifyAll(database);

/*
 since sqlite3 lib doesn't return query results from `run` in a normal way,
 we're adding custom implementation
 */
db.runAsync = (sql, args) => new Promise((resolve, reject) => {
  return db.run(sql, args, function(err) {
    if (err) {
      return reject(err);
    }
    // suppressing warning because `this` contains necessary data
    // eslint-disable-next-line no-invalid-this
    const {sql, lastID, changes} = this;
    return resolve({sql, lastID, changes});
  });
});
module.exports = db;
