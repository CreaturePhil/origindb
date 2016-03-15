'use strict';

const _ = require('lodash');
const createMethods = require('./methods');
const adapters = require('./adapters');

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

  if (_.isUndefined(options)) {
    options = defaultOptions;
  }

  if (!_.has(adapters, options.adapter)) {
    throw new Error('Unknown adapter');
  }

  const save = adapters[options.adapter](name, objects, checksums, options);

  /**
   * The database instance.
   *
   * @param {string} objectName
   * @param {Object} methods
   */
  function db(objectName) {
    if (!_.has(objects, objectName)) objects[objectName] = {};
    return createMethods(objects[objectName], save.bind(null, objectName));
  }

  // backwards compatability with < v2.4.1
  db.save = () => {
    _.forIn(objects, function(value, file) {
      save(file);
    });
  };

  return db;
}

module.exports = OriginDB;
