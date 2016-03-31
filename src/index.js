'use strict';

const _ = require('lodash');
const adapters = require('./adapters');
const createMethods = require('./methods');
const deasync = require('deasync');

const defaultOptions = {
  adapter: 'files'
};

/**
 * Create a database.
 *
 * @param {string} name
 * @param {Object} options
 * @returns {Function} db instance
 */
function OriginDB(name, options) {
  let objects = {};
  let checksums = {};

  if (!_.isString(name)) {
    throw new Error('Invalid name');
  }

  if (_.isObject(options)) {
    options = Object.assign({}, defaultOptions, options);
  } else {
    options = defaultOptions;
  }

  if (_.isString(options.adapter) && !_.has(adapters, options.adapter)) {
    throw new Error('Unknown adapter');
  }

  const save = _.isFunction(options.adapter) ?
    options.adapter(name, objects, checksums, options) :
    adapters[options.adapter](name, objects, checksums, options);

  /**
   * The database instance.
   *
   * @param {string} objectName
   * @param {Object} methods
   */
  function db(objectName) {
    if (_.isBoolean(save.hasLoaded)) deasync.loopWhile(() => !save.hasLoaded);
    if (!_.has(objects, objectName)) objects[objectName] = {};
    return createMethods(objects[objectName], save.bind(null, objectName));
  }

  // backwards compatability with < v2.4.1
  db.save = () => {
    if (_.isBoolean(save.hasLoaded)) deasync.loopWhile(() => !save.hasLoaded);
    _.forIn(objects, function(value, file) {
      save(file);
    });
  };

  return db;
}

module.exports = OriginDB;
