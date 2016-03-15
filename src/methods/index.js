'use strict';

const _ = require('lodash');

const providedMethods = [
  'get',
  'has',
  'keys',
  'set',
  'transform',
  'values',
  'update'
];

function createMethods(object) {
  let methods = {};

  _.forEach(providedMethods, (method) => {
    methods[method] = _[method].bind(null, object);
  });

  _.delete = _.unset.bind(null, object);

  return methods;
}


module.exports = createMethods;
