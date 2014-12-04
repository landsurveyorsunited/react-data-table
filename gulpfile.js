var gulp        = require('gulp');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var concat      = require('gulp-concat');
var reactify    = require('reactify');

gulp.task('script', function() {

  var b = browserify({ debug: true });
  b.add('./src/ReactDataTable.js');

  return b
    .transform(reactify)
    .bundle()
    .pipe(source('ReactDataTable.js'))
    .pipe(gulp.dest('lib'));
});

gulp.task('style', function () {
  return gulp.src('src/styles/main.css')
             .pipe(gulp.dest('dist/css'));
});

gulp.task('template', function() {
  gulp.src('src/index.html')
      .pipe(gulp.dest('dist'));
});

gulp.task('default', ['script', 'style', 'template']);

gulp.task('watch', ['default'], function() {
  gulp.watch('src/**/*.html', ['template']);
  gulp.watch('src/**/*.css',  ['style']);
  gulp.watch('src/**/*.js',   ['script']);
});