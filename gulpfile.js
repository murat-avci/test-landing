const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del =require("del");
const terser = require('gulp-terser');
const htmlmin = require('gulp-htmlmin');

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
};

exports.images = images;

// WebP

const webpImages = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
};

exports.webpImages = webpImages;

// Sprite

const sprite = () => {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

exports.sprite = sprite;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Copy

const copy = () => {
  return gulp.src([
    "source/css/style.css",
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
};

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;


// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html"));
  gulp.watch("source/js/*.js", gulp.series("copy"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(styles, server, watcher);

//HTML

const html = () => {
  return gulp.src(["source/**/*.html"], { base: "source" })
    .pipe(plumber())
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
};

exports.html = html;


//JS

const js = () => {
  return gulp.src('source/js/mobile-top-menu.js')
    .pipe(plumber())
    .pipe(terser())
    .pipe(rename("mobile-top-menu.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
};

exports.js = js;

// Build

gulp.task("build", gulp.series(clean, copy, styles, images, webpImages, sprite, html, js));

// Gulp start

gulp.task("start", gulp.series("build", server, watcher));