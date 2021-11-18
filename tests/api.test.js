'use strict';

const request = require('supertest');
const {assert} = require('chai');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

const TEST_DATA = {
  'new_ride': {
    'start_lat': 40,
    'start_long': 50,
    'end_lat': 40,
    'end_long': 50,
    'rider_name': 'John rider',
    'driver_name': 'Michel Knight',
    'driver_vehicle': 'Ford GT550',
  },
  'new_ride_res': {
    'rideID': 1,
    'startLat': 40,
    'startLong': 50,
    'endLat': 40,
    'endLong': 50,
    'riderName': 'John rider',
    'driverName': 'Michel Knight',
    'driverVehicle': 'Ford GT550',
  },
  'rides_empty_res': {
    'error_code': 'RIDES_NOT_FOUND_ERROR',
    'message': 'Could not find any rides',
  },
  'validation': [
    {
      'field': 'start_lat',
      'value': -180,
      'response': {
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      },
    },
    {
      'field': 'end_lat',
      'value': -180,
      'response': {
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      },
    },
    {
      'field': 'rider_name',
      'value': '',
      'response': {
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      },
    },
    {
      'field': 'driver_name',
      'value': '',
      'response': {
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      },
    },
    {
      'field': 'driver_vehicle',
      'value': '',
      'response': {
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      },
    },
  ],
};

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      return done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app).
          get('/health').
          expect('Content-Type', /text/).
          expect(200, done);
    });
  });
  describe('GET /rides', () => {
    it('should return error', (done) => {
      request(app).
          get('/rides').
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => {
            assert.include(res.body, TEST_DATA.rides_empty_res);
          }).
          expect(200, done);
    });
  });

  describe('POST /rides', () => {
    it('should return inserted entity', (done) => {
      request(app).
          post('/rides').
          send(TEST_DATA.new_ride).
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => {
            const data = res.body[0];
            assert.include(data, TEST_DATA.new_ride_res);
          }).
          expect(200, done);
    });
  });
  describe('GET /rides', () => {
    it('should return list with one entity', (done) => {
      request(app).
          get('/rides').
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => {
            assert.include(res.body[0], TEST_DATA.new_ride_res);
          }).
          expect(200, done);
    });
  });
  describe('GET /rides/:id', () => {
    it('should return entity by ID', (done) => {
      request(app).
          get(`/rides/1`).
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => {
            assert.include(res.body[0], TEST_DATA.new_ride_res);
          }).
          expect(200, done);
    });
  });
  describe('GET /rides/:id', () => {
    it('should return error', (done) => {
      request(app).
          get(`/rides/100500`).
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => {
            assert.include(res.body, TEST_DATA.rides_empty_res);
          }).
          expect(200, done);
    });
  });

  TEST_DATA.validation.forEach((testSample) => {
    const testData = Object.assign({}, TEST_DATA.new_ride);
    testData[testSample.field] = testSample.value;
    describe('POST /rides validation', () => {
      it('should return validation error', (done) => {
        request(app).
            post('/rides').
            send(testData).
            expect('Content-Type', 'application/json; charset=utf-8').
            expect((res) => {
              assert.include(res.body, testSample.response);
            }).
            expect(200, done);
      });
    });
  });
});
