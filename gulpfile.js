// Fetch required plugins
const gulp = require("gulp");
const { src, dest, watch, series, parallel } = require("gulp");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const terser = require("gulp-terser");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browsersync = require("browser-sync").create();

// All paths
const paths = {
  html: {
    src: ["./src/**/*.html"],
    dest: "./dist/",
  },
  images: {
    src: ["./src/content/images/**/*"],
    dest: "./dist/content/images/",
  },
  styles: {
    src: ["./src/scss/**/*.scss"],
    dest: "./dist/css/",
  },
  scripts: {
    src: ["./src/js/**/*.js"],
    dest: "./dist/js/",
  },
  cachebust: {
    src: ["./dist/**/*.html"],
    dest: "./dist/",
  },
};

// Copy html files
function copyHtml() {
  return src(paths.html.src).pipe(dest(paths.html.dest));
}

function optimizeImages() {
  return src(paths.images.src)
    .pipe(imagemin().on("error", (error) => console.log(error)))
    .pipe(dest(paths.images.dest));
}

function compileStyles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.styles.dest));
}

function minifyScripts() {
  return src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(terser().on("error", (error) => console.log(error)))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.scripts.dest));
}

function cacheBust() {
  return src(paths.cachebust.src)
    .pipe(replace(/cache_bust=\d+/g, "cache_bust=" + new Date().getTime()))
    .pipe(dest(paths.cachebust.dest));
}

function watcher() {
  watch(paths.html.src, series(copyHtml, cacheBust));
  watch(paths.images.src, optimizeImages);
  watch(paths.styles.src, parallel(compileStyles, cacheBust));
  watch(paths.scripts.src, parallel(minifyScripts, cacheBust));
}

// BrowserSync
function browserSync() {
  browsersync({
    proxy: "http://localhost",
    browser: ["chrome"],
    port: 3000,
    notify: false,
    open: true,
  });
}

// BrowserSync reload
function browserReload() {
  return browsersync.reload;
}

const watching = parallel(watcher, browserSync);

// Export tasks to make them public
exports.watch = watching;
exports.default = series(
  parallel(copyHtml, optimizeImages, compileStyles, minifyScripts),
  cacheBust,
);
