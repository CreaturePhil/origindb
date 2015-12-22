var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('default', function() {
  return gulp.src(['./index.js', 'test/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});
