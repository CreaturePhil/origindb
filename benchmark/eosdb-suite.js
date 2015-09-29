var eosdb = require('../index');
var rimraf = require('rimraf');

var suites = [
  {
    name: 'basic inserts',
    iterations: 1000,
    before: function() {
      this.db = eosdb('db');
    },
    after: function() {
      rimraf.sync('db'); 
    },
    bench: function(i, next) {
      var db = this.db;
      db('str')[''+i] = ''+i;
      db('num')[i] = i;
      db.save(function() {
        next();
      });
    }
  }
];

module.exports = suites;
