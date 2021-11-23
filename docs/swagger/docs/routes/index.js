const getAllRides = require('./getAllRides');
const getRideById = require('./getRideById');
const saveNewRide = require('./saveNewRide');
const checkHealth = require('./checkHealth');

module.exports = {
  paths: {
    '/rides': {
      ...getAllRides,
      ...saveNewRide,
    },
    '/rides/{id}': {
      ...getRideById,
    },
    '/health': {
      ...checkHealth,
    },
  },
};
