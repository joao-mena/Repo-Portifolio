const { series, parallel, src, dest, watch } = require("gulp");
const { sync } = require("glob");
const sass = require("gulp-sass");
const { join, basename } = require("path");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const { exec } = require("child_process");
const { promisify } = require("util");
require("colors");
sass.compiler = require("node-sass");
const path = join(__dirname, "src");
const execAsync = promisify(exec);

const compileSCSS = () =>
  src(sync(join(path, "scss", "**/*.scss")))
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"));

const compileJS = () =>
  src(sync(join(path, "js", "**/*.js")))
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      }),
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/js"));

const minifyCSS = () =>
  src(sync(join("dist", "**/!(*.min).css")))
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(
      rename(({ dirname, basename }) => ({
        dirname,
        basename: `${basename}.min`,
        extname: ".css",
      })),
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"));

const minifyJS = () =>
  src(sync(join("dist", "**/*.js")))
    .pipe(uglify())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/js"));

const dev = () => {
  browserSync.init({
    server: {
      baseDir: "dist/html",
    },
  });
};

const compileHtml = () =>
  src(sync(join(path, "html", "**/*.html")))
    .on("error", function () {
      notify("HTML include error");
    })
    .pipe(dest("dist/html"));

const watchFiles = (cb) => {
  const jsFiles = sync(join(path, "js", "**/*.js"));
  console.log(`👁️ ${"JavaScript".yellow} files we will watch... 👁️`.bold);
  console.table(jsFiles.map((path) => basename(path)));
  watch(jsFiles, series(compileJS, minifyJS, realoadBrowser));

  const scssFiles = sync(join(path, "scss", "**/*.scss"));
  console.log(`👁️ ${"SCSS".magenta} files we will watch... 👁️`.bold);
  console.table(scssFiles.map((path) => basename(path)));
  watch(scssFiles, series(compileSCSS, minifyCSS, realoadBrowser));

  const htmlFiles = sync(join(path, "html", "**/*.html"));
  console.log(`👁️ ${"HTML".magenta} files we will watch... 👁️`.bold);
  console.table(htmlFiles.map((path) => basename(path)));
  watch(htmlFiles, series(compileHtml, realoadBrowser));
  cb();
};

const realoadBrowser = (cb) => {
  browserSync.reload();
  cb();
};

exports.default = series(
  parallel(compileJS, compileSCSS, compileHtml),
  parallel(minifyCSS, minifyJS),
  watchFiles,
  dev,
);
