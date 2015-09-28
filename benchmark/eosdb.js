var assert = require('assert');
var eosdb = require('../index');
var rimraf = require('rimraf');

suite('eosdb inserts', function() {
  var db;
  var counter = 0;

  before(function() {
    db = eosdb('db');  
  });

  bench('basic inserts', function(next) {
    counter++;
    db('str')[''+counter] = ''+counter;
    db('num')[counter] = counter;
    db.save(function() {
      next();
    });
  });

  after(function() {
    rimraf.sync('db'); 
  });

});

suite('eosdb gets', function() {
  var db;
  var counter = 0;

  set('iterations', 10000);

  before(function() {
    db = eosdb('db');  
  });

  bench('basic inserts', function(next) {
    counter++;
    db('str')[''+counter] = ''+counter;
    db('num')[counter] = counter;
    db.save(function() {
      next();
    });
  });

  after(function() {
    rimraf.sync('db'); 
  });

});

