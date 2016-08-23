var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var eslint = require('gulp-eslint');
var rollup = require('rollup').rollup;
var json = require('rollup-plugin-json');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var babel = require('babel-register')

var version = require('./package.json').version;
var userale = 'userale-' + version;

// Clean build directory
gulp.task('clean', function() {
  return del(['build/*'], { dot : true });
});

// Build the module with Rollup
gulp.task('rollup', function() {
  return rollup({
    entry : 'src/main.js',
    plugins : [
      json()
    ]
  })
  .then(function(bundle) {
    return bundle.write({
      format : 'umd',
      moduleName : 'userale',
      dest : 'build/' + userale + '.js'
    });
  });
});

// Minify and output completed build
gulp.task('build', ['rollup'], function() {
  return gulp.src('build/' + userale + '.js')
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(rename({ suffix : '.min' }))
    .pipe(gulp.dest('build'))
    .pipe(rename('userale-test.min.js'))
    .pipe(gulp.dest('build'));
});

// Lint
gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

// Test
// TODO: separate out tests that depend on built library for faster tests?
gulp.task('test', ['build', 'lint'], function() {
  return gulp.src('test/**/*_spec.js', { read : false })
    .pipe(mocha({
      compilers : {
        js : babel
      }
    }))
    .on('error', function(err) {
      gutil.log(err);
      this.emit('end');
    });
});

// Development mode
gulp.task('dev', ['clean', 'test'], function() {
  gulp.watch(['src/**/*.js', 'test/**/*.{js,html}'], ['test']);
});
