'use strict';
const logger = require('./util/logger');
const _ = require('lodash');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const DEFAULT_LIMIT = 10;

module.exports = (db) => {
  app.get('/health', (req, res) => res.send('Healthy'));

  app.post('/rides', jsonParser, (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    const values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];

    return db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function(err) {
      if (err) {
        logger.error(`Failed to insert data. Reason: ${err.message}`);
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }
      // disabling inspection for following line because it's the only way sqlite returns lastID
      // eslint-disable-next-line no-invalid-this
      const {lastID}=this;
      return db.all('SELECT * FROM Rides WHERE rideID = ?', lastID, function(err, rows) {
        if (err) {
          logger.error(`Failed to fetch record with ID=[${lastID}]. Reason: ${err.message}`);
          return res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          });
        }

        return res.send(rows);
      });
    });
  });

  app.get('/rides', (req, res) => {
    // if offset is missing from params, starting from the beginning
    const offset = _.toInteger(req.query.offset)||0;
    // if limit is missing (or invalid), falling back to default value
    const limit = _.toInteger(req.query.limit)||DEFAULT_LIMIT;
    db.all('SELECT * FROM Rides LIMIT ? OFFSET ?', [limit, offset], function(err, rows) {
      if (err) {
        logger.error(`Failed to load entities. Reason: ${err.message}`);
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      return res.send(rows);
    });
  });

  app.get('/rides/:id', (req, res) => {
    const {id} = req.params;
    db.all(`SELECT *FROM Rides WHERE rideID='${id}'`, function(err, rows) {
      if (err) {
        logger.error(`Failed to fetch entity by ID=[${id}]. Reason: ${err.message}`);
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      return res.send(rows);
    });
  });

  return app;
};
