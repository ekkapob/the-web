var Gulp = require('gulp');
var BrowserSync = require('browser-sync').create();
var Nodemon = require('gulp-nodemon');
var Sass = require('gulp-sass');
var Sourcemaps = require('gulp-sourcemaps');
var Autoprefixer = require('gulp-autoprefixer');

Gulp.task('start', ['nodemon', 'browser-sync', 'watch']);

Gulp.task('sass', () => {
  Gulp.src('./assets/scss/app.scss')
    .pipe(Sourcemaps.init())
      .pipe(Sass({
        outputStyle: 'compressed'
      }).on('error', Sass.logError))
      .pipe(Autoprefixer())
    .pipe(Sourcemaps.write('./'))
    .pipe(Gulp.dest('./assets/css'))
    .pipe(BrowserSync.stream());
});

Gulp.task('watch', () => {
  Gulp.watch('./assets/scss/**/*.scss', ['sass']);
});

Gulp.task('nodemon', () => {
  // Hapi caches partials, need to restart server and reload page
  // https://github.com/hapijs/hapi/issues/1564
  Nodemon({
    script: 'index.js',
    ext: 'hbs js'
  })
  .on('restart', () => {
    console.log('[restarted server!]');
  })
  .on('start', () => {
    setTimeout(BrowserSync.reload, 1000);
  });
});

Gulp.task('browser-sync', () => {
  const init = () => {
    BrowserSync.init({
      proxy: "localhost:4000"
    });
  };
  setTimeout(init, 1000);
});

Gulp.task('default', ['start']);
