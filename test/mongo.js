var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var origindb = require('../src');

var url = 'mongodb://localhost:27017/myproject';

function readJSON(cb) {
  'use strict';

  setTimeout(function() {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;

      db.collection('origindb').find({}).toArray(function(err, docs) {
        if (err) throw err;

        docs.forEach(function(doc) {
          if (doc.name === 'foo') {
            cb(JSON.parse(doc.data));
          }
        });

        db.close();
      });
    });
  }, 30);
}

function remove(done) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    db.collection('origindb').remove({}, function(err) {
      if (err) throw err;

      db.close();
      done();
    });
  });
}

describe('database with mongo adapter', () => {
  'use strict';

  var db;

  beforeEach((done) => {
    remove(done);
  });

  after((done) => {
    remove(done);
  });

  describe('CRUD', () => {

    beforeEach(() => {
      db = origindb(url, {adapter: 'mongo'});
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
      db = origindb(url, {adapter: 'mongo'});
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

  describe('delete prop', () => {

    beforeEach(() => {
      db = origindb(url, {adapter: 'mongo'});
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

  describe('has prop', () => {

    before(() => {
      db = origindb(url, {adapter: 'mongo'});
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

});
