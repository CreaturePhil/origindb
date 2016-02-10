'use strict';

var _ = require('lodash');
var fs = require('graceful-fs');
var jph = require('json-parse-helpfulerror');
var path = require('path');
var steno = require('steno');

module.exports = function(dbDir) {
  if (!dbDir || typeof dbDir !== 'string') {
    throw new Error("Must provide a directory.");
  }

  var cacheObject = {};
  var checksums = {};

  try {
    fs.statSync(dbDir);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      fs.mkdirSync(dbDir);
    }
  }

  var dir = fs.readdirSync(dbDir);

  _.chain(dir)
   .filter(function(file) {
    return file.indexOf('.json') >= 0 && file.indexOf('~') < 0;
   })
   .forEach(function(file) {
      var fileDir = path.join(dbDir, file);
      var fileName = file.slice(0, -5);
      var data = (fs.readFileSync(fileDir, 'utf-8') || '').trim();

      try {
        cacheObject[fileName] = jph.parse(data);
        checksums[fileName] = JSON.stringify(cacheObject[fileName]);
      } catch (e) {
        if (e instanceof SyntaxError) e.message = 'Malformed JSON in file: ' + file + '\n' + e.message;
        throw e;
      }
   })
   .value();

  function save() {
    _.forIn(cacheObject, function(value, file) {
      var jsonData = JSON.stringify(cacheObject[file]);

      if (jsonData === checksums[file]) return;

      checksums[file] = jsonData;
      write(file, cacheObject[file]);
    });
  }

  function write(file, json, cb) {
    var fileDir = path.join(dbDir, file + '.json');
    steno.writeFile(fileDir, JSON.stringify(json, null, 2), function(err) {
      if (err) throw err;
    });
  }

  function db(file) {
    if (!cacheObject[file]) cacheObject[file] = {};
    var obj = cacheObject[file];

    // methods
    return {
      get: function(prop, defaultValue) {
        var value = _.get(obj, prop);

        return typeof value === 'undefined' ? defaultValue : value;
      },

      set: function(prop, value) {
        _.set(obj, prop, value);
        save();
        return this;
      },

      object: function() {
        return obj;
      },

      has: function(prop) {
        return _.has(obj, prop);
      },

      delete: function(prop) {
        _.unset(obj, prop);
        save();
        return this;
      }
    };
  }

  db.save = save;

  return db;
};
