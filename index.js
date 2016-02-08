var fs = require('graceful-fs');
var jph = require('json-parse-helpfulerror');
var path = require('path');
var steno = require('steno');

module.exports = function(dbDir) {
  'use strict';

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

  fs.readdirSync(dbDir).filter(function(file) {
    return file.indexOf('.json') >= 0 && file.indexOf('~') < 0;
  }).forEach(function(file) {
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
  });

  function save() {
    for (var file in cacheObject) {
      var jsonData = JSON.stringify(cacheObject[file]);

      if (jsonData === checksums[file]) continue;

      checksums[file] = jsonData;
      write(file, cacheObject[file]);
    }
  }

  function write(file, json, cb) {
    var fileDir = path.join(dbDir, file + '.json');
    steno.writeFile(fileDir, JSON.stringify(json, null, 2), function(err) {
      if (err) throw err;
    });
  }

  function db(file) {
    if (!cacheObject[file]) cacheObject[file] = {};

    // methods
    return {
      get: function(prop, defaultValue) {
        var value = cacheObject[file][prop];

        if (Array.isArray(prop)) {
          value = prop.reduce(function(acc, cur) {
            if (typeof acc === 'undefined') return;
            return typeof acc[cur] === 'undefined' ? undefined : acc[cur];
          }, cacheObject[file]);
        }

        return typeof value === 'undefined' ? defaultValue : value;
      },

      set: function(prop, value) {
        if (Array.isArray(prop)) {
          var nested = cacheObject[file];
          var length = prop.length;
          var lastIndex = length - 1;

          for (var i = 0; i < length; i++) {
            if (i === lastIndex) break;
            var key = prop[i];
            if (nested[key] == null) {
              nested[key] = {};
              nested = nested[key];
            } else {
              nested = nested[key];
            }
          }
          nested[prop[lastIndex]] = value;
        } else {
          cacheObject[file][prop] = value;
        }

        save();
        return this;
      },

      object: function() {
        return cacheObject[file];
      },

      delete: function(prop) {
        delete cacheObject[file][prop];
        save();
        return this;
      }
    };
  }

  db.save = save;

  return db;
};
