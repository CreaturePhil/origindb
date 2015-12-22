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

  function db(file) {
    if (!cacheObject[file]) cacheObject[file] = {};
    return cacheObject[file];
  }

  function save(cb) {
    for (var file in cacheObject) {
      var jsonData = JSON.stringify(cacheObject[file]);

      if (jsonData === checksums[file]) continue;

      checksums[file] = jsonData;
      write(file, cacheObject[file], cb);
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

  return db;
};
