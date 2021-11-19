'use strict';

const request = require('supertest');
const {assert} = require('chai');

const db = require('../src/db/db');
const ridesService = require('../src/services/rides');
const app = require('../src/app');

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
  'rides_sql_inj': {
    'start_lat': 40,
    'start_long': 50,
    'end_lat': 40,
    'end_long': 50,
    'rider_name': ';DROP TABLE Rides;--',
    'driver_name': '\';DROP TABLE Rides;--',
    'driver_vehicle': '";DROP TABLE Rides;--',
  },
  'validation': [
    {
      'field': 'start_lat',
      'value': -180,
      'response': {
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude must be between -90 and 90 degrees',
      },
    },
    {
      'field': 'end_lat',
      'value': -180,
      'response': {
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude must be between -90 and 90 degrees',
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
        message: 'Driver name must be a non empty string',
      },
    },
    {
      'field': 'driver_vehicle',
      'value': '',
      'response': {
        error_code: 'VALIDATION_ERROR',
        message: 'Vehicle name must be a non empty string',
      },
    },
  ],
  'injection_ids': [
    '\';DROP TABLE Rides;--',
    '1\';DROP TABLE Rides;--',
    '";DROP TABLE Rides;--',
    '1";DROP TABLE Rides;--',
    '`;DROP TABLE Rides;--',
    '1`;DROP TABLE Rides;--',
  ],
};

describe('API tests', () => {
  before((done) => {
    db.init().
        then(() => done()).
        catch((err) => done(err));
  });
  after((done) => {
    db.runAsync('DROP TABLE Rides;').
        then(() => done()).
        catch(done);
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
          expect(404, done);
    });
  });

  describe('POST /rides', () => {
    it('should return inserted entity', (done) => {
      request(app).
          post('/rides').
          send(TEST_DATA.new_ride).
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => {
            const data = res.body;
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
            assert.include(res.body, TEST_DATA.new_ride_res);
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
          expect(404, done);
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
            expect(400, done);
      });
    });
  });
});

describe('Security tests', () => {
  before((done) => {
    db.init().
        then(() => ridesService.saveNew(TEST_DATA.new_ride)).
        then(() => done()).
        catch((err) => done(err));
  });

  describe('GET /rides injection test', () => {
    TEST_DATA.injection_ids.forEach((injectionId) => {
      it('should throw an error', (done) => {
        request(app).
            get(`/rides/${injectionId}`).
            expect((res) => assert.include(res.body, TEST_DATA.rides_empty_res)).
            expect(404, done);
      });
    });

    it('Should check that DB still exists and contains data', (done) => {
      ridesService.getAll(0, 10).then((records) => assert.equal(records.length, 1)).then(done);
    });
  });
  describe('POST /rides', () => {
    it('should save entity and return it', (done) => {
      request(app).
          post('/rides').
          send(TEST_DATA.rides_sql_inj).
          expect((res) => {
            assert.include(res.body, {rideID: 2});
          }).
          expect(200, done);
    });
    it('Should check that DB still exists and contains data', (done) => {
      ridesService.getAll(0, 10).then((records) => assert.equal(records.length, 2)).then(done);
    });
  });
});
