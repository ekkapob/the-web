var Gulp = require('gulp');
var Concat = require('gulp-concat');
var BrowserSync = require('browser-sync').create();
var Nodemon = require('gulp-nodemon');
var Sass = require('gulp-sass');
var Sourcemaps = require('gulp-sourcemaps');
var Autoprefixer = require('gulp-autoprefixer');
var Uglify = require('gulp-uglify');
var Pump = require('pump');
var Rename = require('gulp-rename');


var assets = ['sass', 'scripts', 'dashboard-scripts'];
if (process.env.ENV == 'production') {
  assets.push('compress-js');
  assets.push('compress-dashboard-js');
}

// Gulp.task('start', ['assets', 'nodemon', 'browser-sync', 'watch']);
Gulp.task('start', ['assets', 'nodemon', 'watch']);

Gulp.task('assets', assets);

Gulp.task('sass', () => {
  Gulp.src([
    './assets/scss/app.scss',
    './assets/scss/dashboard.scss'
    ])
    .pipe(Sourcemaps.init())
      .pipe(Sass({
        outputStyle: 'compressed'
      }).on('error', Sass.logError))
      .pipe(Autoprefixer())
    .pipe(Sourcemaps.write('./'))
    .pipe(Gulp.dest('./assets/css'));
    // .pipe(BrowserSync.stream());
});

Gulp.task('compress-js', (cb) => {
  Pump([
    Gulp.src('./assets/js/dist/app.js'),
    Uglify(),
    Rename('app.min.js'),
    Gulp.dest('./assets/js/dist')
    ], cb);
});

Gulp.task('compress-dashboard-js', (cb) => {
  Pump([
    Gulp.src('./assets/js/dist/dashboard/bundle.js'),
    Uglify(),
    Rename('bundle.min.js'),
    Gulp.dest('./assets/js/dist/dashboard')
    ], cb);
});

Gulp.task('watch', () => {
  Gulp.watch('./assets/scss/**/*.scss', ['sass']);
  Gulp.watch('./assets/js/*.js', ['scripts']);
  Gulp.watch('./assets/js/dashboard/*.js', ['dashboard-scripts']);
});

Gulp.task('scripts', () => {
  Gulp.src(['./assets/js/*.js'])
    .pipe(Sourcemaps.init())
      .pipe(Concat('app.js'))
    .pipe(Sourcemaps.write())
    .pipe(Gulp.dest('./assets/js/dist'));
});

Gulp.task('dashboard-scripts', () => {
  Gulp.src(['./assets/js/dashboard/*.js'])
    .pipe(Sourcemaps.init())
      .pipe(Concat('bundle.js'))
    .pipe(Sourcemaps.write())
    .pipe(Gulp.dest('./assets/js/dist/dashboard'));
});


Gulp.task('nodemon', () => {
  // Hapi caches partials, need to restart server and reload page
  // https://github.com/hapijs/hapi/issues/1564
  Nodemon({
    script: 'index.js',
    ignore: [
      // './assets/js/dist/',
      // './assets/js/dashboard/'
    ],
    // exec: 'source app.env; babel-node',
    exec: 'babel-node',
    ext: 'hbs js json env'
  })
  .on('restart', () => {
    console.log('[restarted server!]');
  })
  .on('start', () => {
    // setTimeout(BrowserSync.reload, 2500);
    // setTimeout(BrowserSync.reload, 1000);
  });
});

Gulp.task('browser-sync', () => {
  const init = () => {
    BrowserSync.init({
      proxy: "localhost:4000"
    });
  };
  init();
  // setTimeout(init, 2000);
});

Gulp.task('default', ['start']);
Gulp.task('build', ['assets']);
