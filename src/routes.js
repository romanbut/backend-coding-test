'use strict';
const ridesRoutes = require('./routes/rides');
const healthRoutes = require('./routes/health');

const router = require('express').Router();

// eslint-disable-next-line valid-jsdoc
/**
 * Function that applies all provided routes from file
 * @param {Router} router - router to apply routes to
 * @param {{type:string,path:string,handler:(req,res)=>Promise}[]} routesArray - array with routes in specified format
 * @returns {void} Nothing
 */
function applyRoutes(router, routesArray) {
  routesArray.forEach((route) => router[route.type](route.path, route.handler));
}

applyRoutes(router, ridesRoutes);
applyRoutes(router, healthRoutes);

module.exports = router;
