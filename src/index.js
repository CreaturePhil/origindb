'use strict';

const _ = require('lodash');
const methods = require('./methods');

const defaultOptions = {
  adapter: 'files',
  bson: false
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
  let save;

  if (!_.isString(name)) {
    throw new Error('Invalid name');
  }

  if (_.isUndefined(options)) {
    options = defaultOptions;
  }

  if (!_.has(adapters, options.adapters)) {
      throw new Error('Unknown adpater');
  }

  const adapter = adapters[options.adapter];
  const save = adapters[options.adapter](name, objects, checksums).bind(null, checksums);
  adapters[options.adapter](name, (savedObjects, save) => {
    objects = savedObjects;
    save = save.bind(null, checksums);
  });

  /**
   * The database instance.
   * @param {string} objectName
   */
  function db(objectName) {
    if (!_.has(objects, objectName)) objects[objectName] = {};
    return createMethods(objects[objectName], save);
  }

  return db;
}
