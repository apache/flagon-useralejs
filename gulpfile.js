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
var composer = require('gulp-uglify/composer');
var gulp = require('gulp');
var del = require('del');
var eslint = require('gulp-eslint');
var log = require('gulplog');
var rollup = require('rollup').rollup;
var json = require('@rollup/plugin-json');
var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var babel = require('babel-register');
var license = require('rollup-plugin-license');
var jsonModify = require('gulp-json-modify');
var filter = require('gulp-filter');
var pump = require('pump');
var replace = require('gulp-replace');
var version = require('./package.json').version;
var uglifyjs = require('uglify-es');
var userale = 'userale-' + version;
var userAleWebExtDirName = 'UserALEWebExtension';

// Clean build directory
gulp.task('clean', function() {
  return del(['build/*'], { dot : true });
});

// Build the module with Rollup
gulp.task('rollup', function() {
  return rollup({
    input : 'src/main.js',
    plugins : [
        license({
          banner: 'Licensed to the Apache Software Foundation (ASF) under one or more\n' +
              'contributor license agreements.  See the NOTICE file distributed with\n' +
              'this work for additional information regarding copyright ownership.\n' +
              'The ASF licenses this file to You under the Apache License, Version 2.0\n' +
              '(the "License"); you may not use this file except in compliance with\n' +
              'the License.  You may obtain a copy of the License at\n' +
              '\n' +
              'http://www.apache.org/licenses/LICENSE-2.0\n' +
              '\n' +
              'Unless required by applicable law or agreed to in writing, software\n' +
              'distributed under the License is distributed on an "AS IS" BASIS,\n' +
              'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
              'See the License for the specific language governing permissions and\n' +
              'limitations under the License.' +
              '\n@preserved'
        }),
        json(),
        resolve(),
        commonjs()
    ]
  })
  .then(function(bundle) {
    return bundle.write({
      file : 'build/' + userale + '.js',
      format : 'iife',
      name: 'userale'
    });
  });
});


// Build the module with Rollup
gulp.task('rollup-web-ext-content', function() {
  return rollup({
    input : 'src/' + userAleWebExtDirName + '/content.js',
    plugins : [
      json(),
      resolve(),
      commonjs()
    ]
  })
  .then(function(bundle) {
    return bundle.write({
      file : 'build/' + userAleWebExtDirName + '/content.js',
      name : 'user-ale-ext-content',
      format : 'esm'
    });
  });
});

// Build the module with Rollup
gulp.task('rollup-web-ext-background', function() {
  return rollup({
    input : 'src/' + userAleWebExtDirName + '/background.js',
    plugins : [
      json(),
      resolve(),
      commonjs()
    ]
  })
  .then(function(bundle) {
    return bundle.write({
      file : 'build/' + userAleWebExtDirName + '/background.js',
      name : 'user-ale-ext-background',
      format : 'esm'
    });
  });
});

// Build the module with Rollup
gulp.task('rollup-web-ext-options', function() {
  return rollup({
    input : 'src/' + userAleWebExtDirName + '/options.js',
    plugins : [
      json(),
      resolve(),
      commonjs()
    ]
  })
  .then(function(bundle) {
    return bundle.write({
      file : 'build/' + userAleWebExtDirName + '/options.js',
      name : 'user-ale-ext-options',
      format : "esm"
    });
  });
});

// Build for the browser web extension
gulp.task('build-web-ext', gulp.series(['rollup-web-ext-content', 'rollup-web-ext-background', 'rollup-web-ext-options'], function() {
    return gulp.src(['src/' + userAleWebExtDirName + '/icons/**/*.*',
              'src/' + userAleWebExtDirName + '/manifest.json',
              'src/' + userAleWebExtDirName + '/optionsPage.html'
              ],
             { base: 'src/' + userAleWebExtDirName + '' })
            .on('error', log.error)
            .pipe(gulp.dest('build/' + userAleWebExtDirName + '/'));
}));

// Minify and output completed build
gulp.task('build', gulp.series(['rollup', 'build-web-ext'], function() {
  return gulp.src(['build/' + userale + '.js'])
      .pipe(uglify({
        output: {
          comments: function (node, comment) {
            if (/@preserved/.test(comment.value)) {
              return true;
            }
          }
        }
      }))
    .on('error', log.error)
    .pipe(rename({ suffix : '.min' }))
    .pipe(gulp.dest('build'))
    .pipe(rename(userale + '.min.js'))
    .pipe(gulp.dest('build'));
}));

// Lint
gulp.task('lint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

// Test
// TODO: separate out tests that depend on built library for faster tests?
gulp.task('test', gulp.series(['build', 'lint'], function() {
  return gulp.src(['test/**/*_spec.js'], { read : false })
    .pipe(mocha({
      require: ['babel-core/register']
    }))
    .on('error', function(err) {
      log.error(err);
      this.emit('end');
    });
}));

// Development mode
gulp.task('dev', gulp.series(['clean', 'test'], function() {
  gulp.watch(['src/**/*.js', 'test/**/*.{js,html}'], gulp.parallel(['test']));
}));
