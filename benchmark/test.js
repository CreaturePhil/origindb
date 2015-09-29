var eosdb = require('../index');
var Benchmark = require('benchmark');
var db = eosdb('db');  

var counter = 0;
//var bench = new Benchmark('foo', {
//  defer: true,
//  fn: function(d) {
//    counter++;
//    db('str')[''+counter] = ''+counter;
//    db('num')[counter] = counter;
//    db.save(function() {
//      d.resolve();
//    });
//  }
//}).run({async: true});

var bench = new Benchmark('foo', {
  // a flag to indicate the benchmark is deferred
  'defer': true,

  // benchmark test function
  'fn': function(deferred) {
    // call resolve() when the deferred test is finished
    deferred.resolve();

  }

});

var suite = new Benchmark.Suite;

// add tests
suite.add('RegExp#test', function(d) {
    counter++;
    db('str')[''+counter] = ''+counter;
    db('num')[counter] = counter;
    db.save(function() {
      d.resolve();
    });
}, {defer: true})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true  });
