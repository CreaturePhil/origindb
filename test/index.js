var assert = require('assert');
var origindb = require('../index');
var fs = require('fs');
var rimraf = require('rimraf');

function readJSON(cb) {
  'use strict';

  setTimeout(() => {
    var data = JSON.parse(fs.readFileSync('db/foo.json'));
    cb(data);
  }, 20);
}

describe('database', () => {
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
      db = origindb('db');
    });

    it('creates', done => {
      db('foo').set('bar', 1);
      assert.deepEqual(db('foo').object(), {bar: 1});
      readJSON(data => {
        assert.deepEqual(data, {bar: 1});
        assert.equal(Object.keys(db('foo').object()).length, 1);
        done();
      });
    });

    it('reads', done => {
      db('foo').set('bar', 1);
      assert.equal(db('foo').get('bar'), 1);
      assert.equal(db('foo').get('baz', 0), 0);
      assert.equal(db('foo').get('bar', 0), 1);
      assert.equal(db('foo').get('boo', 2), 2);
      readJSON(data => {
        assert.deepEqual(data, {bar: 1});
        assert.equal(Object.keys(db('foo').object()).length, 1);
        done();
      });
    });

    it('updates', done => {
      db('foo').set('bar', 1);
      readJSON(data => {
        assert.deepEqual(data, {bar: 1});
        db('foo').set('bar', db('foo').get('bar') + 1);
        readJSON(data => {
          assert.deepEqual(data, {bar: 2});
          assert.equal(db('foo').get('bar'), 2);
          assert.equal(Object.keys(db('foo').object()).length, 1);
          done();
        });
      });
    });

    it('deletes', done => {
      db('foo').set('bar', 1);
      readJSON(data => {
        assert.deepEqual(data, {bar: 1});
        delete db('foo').object().bar;
        db.save();
        readJSON(data => {
          assert.deepEqual(data, {});
          assert.deepEqual(db('foo').object(), {});
          assert.equal(Object.keys(db('foo').object()).length, 0);
          done();
        });
      });
    });

  });

  describe('nested object', () => {

    beforeEach(() => {
      db = origindb('db');
    });

    it('should save and get nested 2 object', done => {
      db('foo').set(['bar', 'baz'], 1);
      assert.deepEqual(db('foo').get(['bar', 'baz']), 1);
      assert.deepEqual(db('foo').object(), {bar: {baz: 1}});
      assert.deepEqual(db('foo').get(['bar', 'boo']), undefined);
      assert.deepEqual(db('foo').get(['bar', 'boo'], 0), 0);
      readJSON(data => {
        assert.deepEqual(data, {bar: {baz: 1}});
        assert.equal(Object.keys(db('foo').object()).length, 1);
        done();
      });
    });

    it('should save and get nested 3 object', done => {
      db('foo').set(['bar', 'baz', 'maz'], 25);
      assert.deepEqual(db('foo').get(['bar', 'baz', 'maz']), 25);
      assert.deepEqual(db('foo').object(), {bar: {baz: {maz: 25}}});
      assert.deepEqual(db('foo').get(['bar', 'baz', 'boo']), undefined);
      assert.deepEqual(db('foo').get(['bar', 'baz', 'boo'], 0), 0);
      readJSON(data => {
        assert.deepEqual(data, {bar: {baz: {maz: 25}}});
        assert.equal(Object.keys(db('foo').object()).length, 1);
        done();
      });
    });

  });

  describe('has prop', () => {

    beforeEach(() => {
      db = origindb('db');
    });

    it('should have a prop', () => {
      db('foo').set('yo', 'ho');
      assert.deepEqual(db('foo').has('yo'), true);
    });

    it('should not have a prop', () => {
      db('foo').delete('yo');
      assert.deepEqual(db('foo').has('yo'), false);
    });

  });

  describe('delete prop', () => {

    beforeEach(() => {
      db = origindb('db');
    });

    it('should delete a prop', (done) => {
      db('foo').set('yo', 'ho');
      db('foo').delete('yo');
      readJSON(data => {
        assert.deepEqual(data, {});
        assert.equal(Object.keys(db('foo').object()).length, 0);
        done();
      });
    });

  });

});
