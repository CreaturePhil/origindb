var eosdbSuites = require('./eosdb-suite.js'); 
//var lowdbSuites = require('./lowdb-suite.js'); 

console.log('\n========== eosdb benchmarks: ==========\n');

console.log('eosdb: \n');
eosdbSuites.forEach(function(suite) {
  console.log('Suite `' + suite.name + '`: \n');
  var results = [];
  suite.before();
  for (var i = 1; i <= suite.iterations; i++) {
    runSuite(suite, i, results);
  }
  called = 0;
});

function runSuite(suite, i, results) {
  var start = process.hrtime();
  var done = false;
  suite.bench(i, function() {
    if (i !== suite.iterations) {
      results.push(calculateTime(process.hrtime(start)));
    } else {
      if (done) return;
      done = true;
      suite.after();
      var sum = results[0] || 0; 
      if (results.length > 1) {
        sum = results.reduce(sumNumber);
      }
      var avg = sum / results.length;
      var mdn = median(results);
      console.log("Total time elapsed: " + sum + " ms");
      console.log("Average Time: " + avg + " ms");
      console.log("Median Time: " + mdn);
    }
  });
}

function calculateTime(hrtime) {
  return (hrtime[0] * 1000) + (hrtime[1] / 1e6);   
}

function sumNumber(a, b) {
  return a + b;
}

function sortNumber(a, b) {
  return a - b;
}

function median(values) {
  values.sort(sortNumber);

  var half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half-1] + values[half]) / 2;
}
