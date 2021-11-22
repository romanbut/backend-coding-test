'use strict';
const logger = require('../util/logger');
const Promise = require('bluebird');
const sqlite = require('sqlite3').verbose();
const dbSchema = require('./schemas');
const DB_NAME = process.env.DB_NAME || ':memory:';

const database = new sqlite.Database(DB_NAME, (/* Error */err) => {
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
db.init = async ()=> await dbSchema(db);
db.clearDB = async ()=> await db.runAsync('DELETE FROM Rides;');
db.destroy = async ()=> await db.runAsync('DROP TABLE IF EXISTS Rides;');

module.exports =db;
