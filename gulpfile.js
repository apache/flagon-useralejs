/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var eslint = require('gulp-eslint');
var rollup = require('rollup').rollup;
var json = require('rollup-plugin-json');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var babel = require('babel-register');
var jsonModify = require('gulp-json-modify');
var filter = require('gulp-filter');
var uglifyHarmony = require('uglify-js-harmony');
var minifier = require('gulp-uglify/minifier');
var replace = require('gulp-replace');

var version = require('./package.json').version;
var userale = 'userale-' + version;
var userAleWebExtDirName = 'UserAleWebExtension';

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
      format : 'iife',
      moduleName : 'userale',
      dest : 'build/' + userale + '.js'
    });
  });
});

// Copy the rolled-up userale.js script into the webext dir
gulp.task('copy-userale-script', ['rollup'], function() {
    return gulp.src('build/' + userale + '.js')
               .pipe(gulp.dest('build/' + userAleWebExtDirName));
})

// Build for the browser web extension
gulp.task('build-web-ext', ['copy-userale-script'], function() {
    // We setup some filters so that we can work on specific files from the stream
    const f1 = filter(['**/*.js'], {restore: true});
    const f2 = filter(['**/manifest.json'], {restore: true});
    const f3 = filter(['**/globals.js'], {restore: true});
    
    return gulp.src(['src/' + userAleWebExtDirName + '/icons/**/*.*',
              'src/' + userAleWebExtDirName + '/*.*',
              '!src/' + userAleWebExtDirName + '/README.md'],
             { base: 'src/' + userAleWebExtDirName + '' })
            .pipe(f1)
            .pipe(minifier({}, uglifyHarmony))
            .on('error', gutil.log)
            .pipe(f1.restore)
            .pipe(f2)
            .pipe(jsonModify({ key: "web_accessible_resources", value: [ userale + '.js' ]}))
            .pipe(f2.restore)
            .pipe(f3)
            .pipe(replace(/userAleScript=\".*?\"/g, 'userAleScript=\'' + userale + '.js\''))
            .pipe(f3.restore)
            .pipe(gulp.dest('build/' + userAleWebExtDirName + '/'));
        
});

// Minify and output completed build
gulp.task('build', ['rollup', 'build-web-ext'], function() {
  return gulp.src('build/' + userale + '.js')
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(rename({ suffix : '.min' }))
    .pipe(gulp.dest('build'))
    .pipe(rename(userale + '.min.js'))
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
