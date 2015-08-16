var fs = require('graceful-fs');
var jph = require('json-parse-helpfulerror');
var path = require('path');
var steno = require('steno');

var base_dir = process.cwd();

module.exports = function(dir) {
  'use strict';

  var db_dir = path.join(base_dir, dir); 

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

  function db(key) {
    if (!cacheObject[key]) cacheObject[key] = {};
    return cacheObject[key];
  }

  function save() {
    for (var key in cacheObject) {
      if (key === 'save') continue;

      var str = JSON.stringify(cacheObject[key]);

      if (str === checksums[key]) continue;

      checksums[key] = str;
      write(key, cacheObject[key]);
    }
  }

  function write(file, json) {
    var file_dir = path.join(db_dir, file + '.json');
    steno.writeFile(file_dir, JSON.stringify(json, null, 2), function(err) {
      if (err) throw err;
    });
  }

  db.save = save;

  return db;
};
