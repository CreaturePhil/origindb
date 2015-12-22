var assert = require('assert');
var eosdb = require('../index');
var fs = require('fs');
var rimraf = require('rimraf');

function readJSON(cb) {
  'use strict';

  setTimeout(() => {
    var data = JSON.parse(fs.readFileSync('db/foo.json'));
    cb(data);
  }, 20);
}

describe('eosdb', () => {
  'use strict';

  var db;

  beforeEach(() => {
    rimraf.sync('db');
  });

  after(() => {
    rimraf.sync('db');
  });

  describe('CRUD', () => {

    beforeEach(() => {
      db = eosdb('db');
    });

    it('creates', (done) => {
      db('foo').bar = 1;
      db.save();
      assert.deepEqual(db('foo'), {bar: 1});
      readJSON((data) => {
        assert.deepEqual(data, {bar: 1});
        assert.equal(db.size('foo'), 1);
        done();
      });
    });

    it('reads', (done) => {
      db('foo').bar = 1;
      db.save();
      assert.equal(db('foo').bar, 1);
      readJSON((data) => {
        assert.deepEqual(data, {bar: 1});
        assert.equal(db.size('foo'), 1);
        done();
      });
    });

    it('updates', (done) => {
      db('foo').bar = 1;
      db.save();
      readJSON((data) => {
        assert.deepEqual(data, {bar: 1});
        db('foo').bar = db('foo').bar + 1;
        db.save();
        readJSON((data) => {
          assert.deepEqual(data, {bar: 2});
          assert.equal(db('foo').bar, 2);
          assert.equal(db.size('foo'), 1);
          done();
        });
      });
    });

    it('deletes', (done) => {
      db('foo').bar = 1;
      db.save();
      readJSON((data) => {
        assert.deepEqual(data, {bar: 1});
        delete db('foo').bar;
        db.save();
        readJSON((data) => {
          assert.deepEqual(data, {});
          assert.deepEqual(db('foo'), {});
          assert.equal(db.size('foo'), 0);
          done();
        });
      });
    });

  });

});
