const base = require('./base');
const components = require('./components');
const servers = require('./servers');
const tags = require('./tags');
const routes = require('./routes');

module.exports = {
  ...base,
  ...components,
  ...servers,
  ...tags,
  ...routes,
};
