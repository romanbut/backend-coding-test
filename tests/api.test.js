'use strict';

const request = require('supertest');
const {assert} = require('chai');
const _ = require('lodash');
const db = require('../src/db/db');
const ridesService = require('../src/services/rides');
const app = require('../src/app');

const TEST_DATA = {
  'generateRandomString': (length) => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length),
  'generateNewRideRequest': function() {
    return {
      'start_lat': _.random(-89, 89),
      'start_long': _.random(-179, 179),
      'end_lat': _.random(-89, 89),
      'end_long': _.random(-179, 179),
      'rider_name': this.generateRandomString(8),
      'driver_name': this.generateRandomString(8),
      'driver_vehicle': this.generateRandomString(8),
    };
  },
  'convertRequestedToResponse': (data) => {
    return {
      'startLat': data['start_lat'],
      'startLong': data['start_long'],
      'endLat': data['end_lat'],
      'endLong': data['end_long'],
      'riderName': data['rider_name'],
      'driverName': data['driver_name'],
      'driverVehicle': data['driver_vehicle'],
    };
  },
  'noRidesResponse': {
    'error_code': 'RIDES_NOT_FOUND_ERROR',
    'message': 'Could not find any rides',
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
  'injectionStrings': [
    '\';DROP TABLE Rides;--',
    '1\';DROP TABLE Rides;--',
    '";DROP TABLE Rides;--',
    '1";DROP TABLE Rides;--',
    '`;DROP TABLE Rides;--',
    '1`;DROP TABLE Rides;--',
  ],
};

describe('API tests', () => {
  beforeEach((done) => {
    db.init().
        then(() => done()).
        catch((err) => done(err));
  });
  afterEach((done) => {
    db.destroy().
        then(() => done()).
        catch(done);
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app).
          get('/health').
          expect('Content-Type', /text/).
          expect((res) => assert.equal(res.text, 'Healthy')).
          expect(200, done);
    });
  });
  describe('GET /rides', () => {
    it('should return error', (done) => {
      request(app).
          get('/rides').
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => assert.include(res.body, TEST_DATA.noRidesResponse)).
          expect(404, done);
    });
    it('should return list with one entity', (done) => {
      let saved = {};
      const generated = TEST_DATA.generateNewRideRequest();
      request(app).
          post('/rides').
          send(generated).
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => {
            assert.include(res.body, {...TEST_DATA.convertRequestedToResponse(generated)});
            saved = res.body;
          }).
          expect(200).
          end(() => {
            request(app).
                get('/rides').
                expect('Content-Type', 'application/json; charset=utf-8').
                expect((res) => {
                  assert.include(res.body[0], saved);
                  assert.equal(res.body.length, 1);
                }).
                expect(200, done);
          });
    });
  });

  describe('POST /rides', () => {
    it('should return inserted entity', (done) => {
      const generated = TEST_DATA.generateNewRideRequest();
      request(app).
          post('/rides').
          send(generated).
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => assert.include(res.body, {...TEST_DATA.convertRequestedToResponse(generated)})).
          expect(200, done);
    });
    TEST_DATA.validation.forEach((testSample) => {
      it(`should fail validation because of [${testSample.field}]`, (done) => {
        const testData = Object.assign({}, TEST_DATA.generateNewRideRequest());
        testData[testSample.field] = testSample.value;
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
    it('should return error because of empty body', (done) => {
      request(app).
          post('/rides').
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => assert.include(res.body, TEST_DATA.validation[0].response)).
          expect(400, done);
    });
  });

  describe('GET /rides/:id', () => {
    it('should return entity by ID', (done) => {
      let saved = {};
      const generated = TEST_DATA.generateNewRideRequest();
      request(app).
          post('/rides').
          send(generated).
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => {
            assert.include(res.body, {...TEST_DATA.convertRequestedToResponse(generated)});
            saved = res.body;
          }).
          expect(200).
          end(() => {
            request(app).
                get(`/rides/${saved.rideID}`).
                expect('Content-Type', 'application/json; charset=utf-8').
                expect((res) => assert.include(res.body, saved)).
                expect(200, done);
          });
    });
    it('should return error', (done) => {
      request(app).
          get(`/rides/100500`).
          expect('Content-Type', 'application/json; charset=utf-8').
          expect((res) => {
            assert.include(res.body, TEST_DATA.noRidesResponse);
          }).
          expect(404, done);
    });
  });
});

describe('Security tests', () => {
  beforeEach((done) => {
    db.init().
        then(() => ridesService.saveNew(TEST_DATA.generateNewRideRequest())).
        then(() => done()).
        catch(done);
  });
  afterEach((done) => {
    db.destroy().
        then(() => done()).
        catch(done);
  });

  describe('GET /rides injection test', () => {
    TEST_DATA.injectionStrings.forEach((injectionId) => {
      it('should throw an error', (done) => {
        request(app).
            get(`/rides/${injectionId}`).
            expect((res) => assert.include(res.body, TEST_DATA.noRidesResponse)).
            expect(404).
            end(() => {
              request(app).
                  get('/rides').
                  expect('Content-Type', 'application/json; charset=utf-8').
                  expect((res) => assert.equal(res.body.length, 1)).
                  expect(200, done);
            });
      });
    });
  });
  describe('POST /rides', () => {
    TEST_DATA.injectionStrings.forEach((injectionString) => {
      it('should save entity and return it', (done) => {
        const injection = {driver_name: injectionString, vehicle_name: injectionString, rider_name: injectionString};
        const data = Object.assign({}, TEST_DATA.generateNewRideRequest(), injection);
        request(app).
            post('/rides').
            send(data).
            expect((res) => assert.include(res.body, {...TEST_DATA.convertRequestedToResponse(data)})).
            expect(200).
            end(() => {
              request(app).
                  get('/rides').
                  expect('Content-Type', 'application/json; charset=utf-8').
                  expect((res) => assert.equal(res.body.length, 2)).
                  expect(200, done);
            });
      });
    });
  });
});
