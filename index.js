var fs = require('graceful-fs');
var jph = require('json-parse-helpfulerror');
var path = require('path');
var steno = require('steno');

module.exports = function(db_dir) {
  'use strict';

  if (!db_dir || typeof db_dir !== 'string') {
    throw new Error("Must provide a directory.");
  }

  var cacheObject = {};
  var checksums = {};

  try {
    fs.statSync(db_dir);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      fs.mkdirSync(db_dir);
    }
  }

  fs.readdirSync(db_dir).filter(function(file) {
    return file.indexOf('.json') >= 0 && file.indexOf('~') < 0;
  }).forEach(function(file) {
    var file_dir = path.join(db_dir, file);
    var file_name = file.slice(0, -5);
    var data = (fs.readFileSync(file_dir, 'utf-8') || '').trim();

    try {
      cacheObject[file_name] = jph.parse(data);
      checksums[file_name] = JSON.stringify(cacheObject[file_name]);
    } catch (e) {
      if (e instanceof SyntaxError) e.message = 'Malformed JSON in file: ' + file + '\n' + e.message;
      throw e;
    }
  });

  function db(jsonFile) {
    if (!cacheObject[jsonFile]) cacheObject[jsonFile] = {};
    return cacheObject[jsonFile];
  }

  function save(cb) {
    for (var key in cacheObject) {
      var str = JSON.stringify(cacheObject[key]);

      if (str === checksums[key]) continue;

      checksums[key] = str;
      write(key, cacheObject[key], cb);
    }
  }

  function write(file, json, cb) {
    var file_dir = path.join(db_dir, file + '.json');
    steno.writeFile(file_dir, JSON.stringify(json, null, 2), function(err) {
      if (err) throw err;
      if (cb && typeof cb === 'function') {
        cb();
      }
    });
  }

  db.save = save;

  /**
   * Helper `get` methods that contains a default value.
   */

  // get an array value, defaults to []
  db.aget = function(jsonFile, key) {
    var value = db(jsonFile)[key];
    if (!Array.isArray(value)) {
      return [];
    }
    return value;
  };

  // get a number value, defaults to 0
  db.nget = function(jsonFile, key) {
    var value = db(jsonFile)[key];
    if (typeof value !== 'number') {
      return 0;
    }
    return value;
  };

  // get a string value, defaults to ""
  db.sget = function(jsonFile, key) {
    var value = db(jsonFile)[key];
    if (typeof value !== 'string') {
      return 0;
    }
    return value;
  };

  return db;
};
