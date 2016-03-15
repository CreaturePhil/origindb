'use strict';

const _ = require('lodash');
const fs = require('fs');
const jph = require('json-parse-helpfulerror');
const path = require('path');

function Files(name, objects, checksums) {
  try {
    fs.statSync(name);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      fs.mkdirSync(name);
    }
  }

  const dir = _.filter(fs.readdirSync(name), (file) => {
    return file.indexOf('.json') >= 0 && file.indexOf('~') < 0;
  });

  _.forEach(dir, (file) => {
    const fileDir = path.resolve(name, file);
    const fileName = file.slice(0, -5);
    const data = (fs.readFileSync(fileDir, 'utf-8') || '').trim();

    try {
      objects[fileName] = jph.parse(data);
      checksums[fileName] = JSON.stringify(objects[fileName]);
    } catch (e) {
      if (e instanceof SyntaxError) {
        e.message = 'Malformed JSON in file: ' + file + '\n' + e.message;
      }
      throw e;
    }
  });
}
