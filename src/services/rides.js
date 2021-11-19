'use strict';
const logger = require('../util/logger');
const db = require('../db/db');
const _ = require('lodash');
const BackendError = require('../util/backendException');

const DEFAULT_PAGE_SIZE = 10;

/** @typedef {{
 * start_lat:number,
 * start_long:number,
 * end_lat:number,
 * end_long:number,
 * rider_name:string,
 * driver_name:string,
 * driver_vehicle:string}} RideReq*/
/** @typedef {{
 * rideID:number,
 * startLat:number,
 * startLong:number,
 * endLat:number,
 * endLong:number,
 * riderName:string,
 * driverName:string,
 * driverVehicle:string,
 * created:number}} Ride*/
/** @typedef {{error_code:string,message:string}} ErrorRes*/
const ridesService = {
  /**
   * Method to fetch Ride by ID
   * @param {string|number}id - ID of ride to fetch
   * @throws {BackendError} in case if no entity with provided ID was found
   * @return {Promise<Ride>} ride with provided ID
   */
  getById: async function(id) {
    logger.debug(`Entity with ID ${id} requested`);
    const rows = await db.allAsync(`SELECT * FROM Rides WHERE rideID=?`, [id]);
    if (_.isEmpty(rows)) {
      logger.warn(`Entity with ID ${id} doesn't exists`);
      throw new BackendError('RIDES_NOT_FOUND_ERROR', 'Could not find any rides', 404);
    }
    return _.first(rows);
  },
  /**
   * Method that returns page of rides
   * @param {string|number}offset=0 - starting record
   * @param {string|number}size=10
   * @throws {BackendError} if no data was found
   * @return {Promise<Ride[]>} list with requested entities
   */
  getAll: async function(offset, size) {
    const off = _.toInteger(offset) || 0;
    const s = _.toInteger(size) || DEFAULT_PAGE_SIZE;
    logger.debug(`Page with offsets start=${off} limit=${s} was requested`);
    const rows = await db.allAsync(`SELECT * FROM Rides LIMIT ? OFFSET ?`, [s, off]);
    if (_.isEmpty(rows)) {
      logger.warn(`No data found for page with start=${off} and limit=${s}`);
      throw new BackendError('RIDES_NOT_FOUND_ERROR', 'Could not find any rides', 404);
    }
    return rows;
  },
  /**
   * Method that takes incoming data, validates it, stores it in the DB and returns saved entity
   * @param {RideReq} incoming incoming data to validate and save
   * @throws {BackendError} in case if validation fails
   * @return {Promise<Ride>} saved entity
   */
  saveNew: async function(incoming) {
    logger.debug(`Saving new entity to the DB`);
    const hasErrors = checkForErrors(incoming);
    if (hasErrors) {
      logger.warn(`Entity creation aborted. Reason: ${hasErrors.message}`);
      throw new BackendError(hasErrors.error_code, hasErrors.message, 400);
    }
    const dataToInsert = [
      incoming.start_lat,
      incoming.start_long,
      incoming.end_lat,
      incoming.end_long,
      incoming.rider_name,
      incoming.driver_name,
      incoming.driver_vehicle,
    ];
    const result = await db.runAsync(
        'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
        dataToInsert);
    logger.debug(`Entity saved with ID=${result.lastID}`);
    const savedEntity = await this.getById(result.lastID);
    return savedEntity;
  },
};

/* eslint-disable camelcase */
/**
 * @param {RideReq} incoming - data to validate
 * @return {boolean|ErrorRes} - either `false` if data is valid, or {Error} if there are some errors
 */
function checkForErrors(incoming) {
  const error_code = 'VALIDATION_ERROR';
  const checks = {
    isValidLat: (val) => _.isInteger(val) && val > -90 && val < 90,
    isValidLon: (val) => _.isInteger(val) && val > -180 && val < 180,
    isNonEmptyStr: (minLength) => (val) => _.isString(val) && (val.length >= minLength),
  };
  const validationRules = [
    {
      field: 'start_lat',
      check: checks.isValidLat,
      message: 'Start latitude must be between -90 and 90 degrees',
    }, {
      field: 'start_long',
      check: checks.isValidLon,
      message: 'Start longitude must be -180 to 180 degrees',
    }, {
      field: 'end_lat',
      check: checks.isValidLat,
      message: 'End latitude must be between -90 and 90 degrees',
    }, {
      field: 'end_long',
      check: checks.isValidLon,
      message: 'End longitude must be -180 to 180 degrees',
    }, {
      field: 'driver_name',
      check: checks.isNonEmptyStr(1),
      message: 'Driver name must be a non empty string',
    }, {
      field: 'rider_name',
      check: checks.isNonEmptyStr(1),
      message: 'Rider name must be a non empty string',
    }, {
      field: 'driver_vehicle',
      check: checks.isNonEmptyStr(1),
      message: 'Vehicle name must be a non empty string',
    },
  ];
  if (!incoming) {
    return {
      error_code,
      message: 'Missing data',
    };
  }
  // eslint-disable-next-line guard-for-in
  for (let idx = 0; idx < validationRules.length; idx++) {
    const rule = validationRules[idx];
    const value = _.get(incoming, rule.field);
    if (!rule.check(value)) {
      return {
        error_code,
        message: rule.message,
      };
    }
  }
  return false;
}

/* eslint-enable camelcase */
module.exports = ridesService;
