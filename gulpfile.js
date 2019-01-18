var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');

//Task for processing js with browserify
gulp.task('js', function(){
  gulp.src('src/javascripts/*.js')
   .pipe(concat('bundle.js'))
   .pipe(browserify())
   .pipe(gulp.dest('public/javascripts'));
 });


gulp.task('default', [ 'js'] );


