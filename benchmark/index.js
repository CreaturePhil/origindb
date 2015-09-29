var fs = require('fs');
var util = require('util');
var EE = require('events');
var eosdb = require('../index');
var counter = 0;
var rimraf = require('rimraf');
    var db = eosdb('db');  

for (var i = 0; i < 1000; i++) {
  hi(i);
}

var a = [];
function hi(i) {
    counter++;
    var t1 = process.hrtime();
    db('str')[''+counter] = ''+counter;
    db('num')[counter] = counter;
    db.save(function() {
      var end = process.hrtime(t1);
      console.log(end[1]/1000000);
      a.push(end[1]/1000000);
      if (i === 999) {
        var sum = a.reduce(function(a, b) { return a + b;  });
        var avg = sum / a.length;
console.log(avg);
console.log(median(a.sort(sortNumber)));
      }
    });
}
function sortNumber(a,b) {
      return a - b;
      
}

function median(values) {
  
      values.sort( function(a,b) {return a - b;}  );

          var half = Math.floor(values.length/2);

              if(values.length % 2)
                        return values[half];
                          else
                                    return (values[half-1] + values[half]) / 2.0;
                                  
}
