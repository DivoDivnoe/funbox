const gulp = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const pug = require('gulp-pug');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const del = require('del');
const browserSync = require('browser-sync').create();

const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const paths = {
  root: 'build',
  pug: {
    src: 'src/pug/pages/*.pug',
    dest: 'build'
  },
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'build/css'
  },
  img: {
    src: 'src/img/*.{png,jpg,svg}',
    dest: 'build/img'
  },
  fonts: {
    src: 'src/fonts/**/*.{woff,woff2}',
    dest: 'build/fonts'
  },
  js: {
    src: 'src/js/**/*.js',
    dest: 'build/js'
  }
};

gulp.task('clean', () => del(paths.root));

gulp.task('copy-img', () => {
  return gulp
    .src(paths.img.src)
    .pipe(
      imagemin([
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 3})
      ])
    )
    .pipe(gulp.dest(paths.img.dest));
});

gulp.task('copy-fonts', () => {
  return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest));
});

gulp.task('scss', () => {
  return gulp
    .src('src/scss/style.scss')
    .pipe(
      plumber({
        errorHandler: notify.onError(error => {
          return {
            title: 'Styles',
            message: error.message
          };
        })
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: require('node-normalize-scss').includePaths
      })
    )
    .pipe(sourcemaps.write())
    .pipe(
      postcss([
        autoprefixer({
          browsers: ['last 2 versions']
        })
      ])
    )
    .pipe(gulp.dest('build/css'))
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.scss.dest));
});

gulp.task('pug', () => {
  return gulp
    .src(paths.pug.src)
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.pug.dest));
});

gulp.task('js', () => {
  return gulp
    .src('src/js/main.js')
    .pipe(
      plumber({
        errorHandler: notify.onError(error => {
          return {
            title: 'Scripts',
            message: error.message
          };
        })
      })
    )
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('watch', () => {
  gulp.watch(paths.pug.src, gulp.series('pug'));
  gulp.watch(paths.scss.src, gulp.series('scss'));
  gulp.watch(paths.img.src, gulp.series('copy-img'));
  gulp.watch(paths.fonts.src, gulp.series('copy-fonts'));
  gulp.watch(paths.js.src, gulp.series('js'));
});

gulp.task('serve', () => {
  browserSync.init({
    server: paths.root
  });
  browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
});

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel(gulp.series('copy-img'), 'copy-fonts', 'scss', 'pug', 'js'),
    gulp.parallel('watch', 'serve')
  )
);
