'use strict';

const _ = require('lodash');

/**
 * Methods provided by lodash.
 * Brackets [] indicates the method will invoke `save()` afterwards.
 * In addition, to returning `this` to chain methods.
 */
const providedMethods = [
  'get',
  'has',
  'keys',
  ['set'],
  'transform',
  ['unset'],
  'values',
  ['update']
];

/**
 * @param {Object} object
 * @param {Function} save
 * @returns {Function} methods
 */
function createMethods(object, save) {
  let methods = {};

  _.forEach(providedMethods, (method) => {
    const bindedMethod = _[method].bind(null, object);
    if (_.isString(method)) {
      methods[method] = bindedMethod;
    } else {
      methods[method] = _.flow(bindedMethod, save, () => methods);
    }
  });

  // backwards compatability with < v2.4.1
  methods.delete = methods.unset;

  methods.object = () => object;

  return methods;
}

module.exports = createMethods;
