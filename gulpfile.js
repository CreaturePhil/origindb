var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('default', function () {
  return gulp.src('./index.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});
