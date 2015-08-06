/*global -$ */
'use strict';

// ########################################
// Modules
// ########################################
var del               = require('del'),
    through2          = require('through2'),
    browserify        = require('browserify'),
    babelify          = require('babelify'),
    mqpacker          = require('css-mqpacker'),
    autoprefixer      = require('autoprefixer-core'),
    mainBowerFiles    = require('main-bower-files'),
    wiredep           = require('wiredep').stream;

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  scope: ['devDependencies'],
  camelize: true,
  lazy: false,
});

// ########################################
// Variables
// ########################################

// current enviroment
var env = process.env.NODE_ENV || 'development';

var IN_BASE  = 'src/';
var OUT_BASE = 'public/';
var BOWER    = 'bower_components/';

var IN  = {
  CSS   : IN_BASE + 'scss/',
  JS    : IN_BASE + 'js/',
  IMG   : IN_BASE + 'img/',
  FONTS : IN_BASE + 'fonts/',
  HTML  : IN_BASE + 'html/',
};

var OUT = {
  CSS   : OUT_BASE + 'stylesheets/',
  JS    : OUT_BASE + 'javascripts/',
  IMG   : OUT_BASE + 'images/',
  FONTS : OUT_BASE + 'fonts/',
  HTML  : OUT_BASE,
  ICONS : OUT_BASE + 'icons/',
};


// ########################################
// Helpers
// ########################################
var isProduction = function() {
  return env === 'production';
};

var isDevelopment = function() {
  return env === 'development';
};


// ########################################
// Tasks
// ########################################

gulp.task('clean', function(cb) {
  del([OUT_BASE], cb);
});


// ####################
// CSS
// ####################
gulp.task('styles', function() {
  var processors = [
    // autoprefix css
    autoprefixer({
      browsers: ['> 5%'],
      cascade: true,
      remove: true,
    }),
    // combine identical media queries
    mqpacker({})
  ];

  return gulp.src(IN.CSS + '**/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/,
      overrides: {
        'modularized-normalize-scss': {
          main: '_normalize.scss'
        }
      }
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss(processors))
    .pipe($.if(isProduction(), $.minifyCss({
      keepSpecialComments: 0,
      processImport: true,
    })))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(OUT.CSS))
    .pipe($.livereload());
});


// ####################
// HTML
// ####################
gulp.task('html', function() {
  return gulp.src(IN.HTML + '**/*.html')
    .pipe(gulp.dest(OUT.HTML))
    .pipe($.livereload());
});

// ####################
// IMAGES
// ####################
gulp.task('images', function() {

  return gulp.src(IN.IMG + '**/*')
    .pipe($.if (isProduction(), $.cache(
        $.imagemin({
          optimizationLevel: 3,
          progressive: true,
          interlaced: true,
          svgoPlugins: [{
            cleanupIDs: false
          }] // don't remove IDs from SVGs
        })
      )))
    .pipe(gulp.dest(OUT.IMG))
    .pipe($.livereload());
});


// ####################
// FONTS
// ####################
gulp.task('fonts', function() {
  var fileTypes = '**/*.{eot,svg,ttf,woff,woff2}';

  // return gulp.src(
  //   mainBowerFiles({
  //     includeDev: false,
  //     filter: fileTypes,
  //     checkExistence: false
  //   })
  //   .concat(IN.FONTS + fileTypes)
  // )
  return gulp.src(IN.FONTS + fileTypes)
    .pipe(gulp.dest(OUT.FONTS))
    .pipe($.livereload());
});


// ####################
// Javacript
// ####################
gulp.task('browserify', function() {

  return gulp.src(IN.JS + 'site.js')
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path, {
        debug        : isProduction(),
        // builtins     : false,
        insertGlobals: false,
        cache        : {},
        packageCache : {},
        fullPaths    : false
      })
        .transform(babelify)
        .bundle(function (err, res) {
          if(err)
            return next(err);

          file.contents = res;
          next(null, file);
        });
    })).on('error', function (error) {
      console.log(error.stack);
      this.emit('end');
    })
    // .pipe($.rename('site.js'))
    .pipe(gulp.dest(OUT.JS))
    .pipe($.livereload());
});

// ####################
// TASKS
// ####################
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'images', 'fonts', 'browserify', 'html', function(){

    // only launch in development
    if(isDevelopment()) {
      gulp.start('watch', function() {
        console.log('Listening for changes');
      });  
    }
    
  });
});

gulp.task('watch', function () {
  $.livereload.listen();

  // bower.json
  // package.json
  gulp.watch(IN.FONTS + '**/*', ['fonts']);
  gulp.watch(IN.IMG + '**/*', ['images']);
  gulp.watch(IN.JS + '**/*.{js,jsx}', ['browserify']);
  gulp.watch(IN.CSS + '**/*.scss', ['styles']);
  gulp.watch(IN.HTML + '**/*.html', ['html']);
});