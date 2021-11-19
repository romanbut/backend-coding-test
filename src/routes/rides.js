const _ = require('lodash');
const ridesService = require('../services/rides');

const rideRoutes = [
  {
    type: 'get',
    path: '/rides',
    handler: async (req, res, next) => {
      const offset = _.toInteger(req.query.offset);
      const limit = _.toInteger(req.query.limit);
      try {
        const result = await ridesService.getAll(offset, limit);
        return res.send(result);
      } catch (err) {
        return next(err);
      }
    },
  }, {
    type: 'get',
    path: '/rides/:id',
    handler: async (req, res, next) => {
      const {id} = req.params;
      try {
        const result = await ridesService.getById(id);
        return res.send(result);
      } catch (err) {
        return next(err);
      }
    },
  }, {
    type: 'post',
    path: '/rides',
    handler: async (req, res, next) => {
      // eslint-disable-next-line camelcase
      const {start_lat, start_long, end_lat, end_long, rider_name, driver_name, driver_vehicle} = req.body;
      try {
        const result = await ridesService.saveNew(
            {start_lat, start_long, end_lat, end_long, rider_name, driver_name, driver_vehicle});
        return res.send(result);
      } catch (err) {
        return next(err);
      }
    },
  },
];

module.exports = rideRoutes;
