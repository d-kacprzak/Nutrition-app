const gulp          = require("gulp");
const sass          = require("gulp-sass");
const sourcemaps    = require("gulp-sourcemaps");
const autoprefixer  = require("gulp-autoprefixer");
const colors        = require("ansi-colors");
const notifier      = require("node-notifier");
const rename        = require("gulp-rename");
const wait          = require("gulp-wait");
const csso          = require("gulp-csso");
const browserSync   = require("browser-sync").create();
const webpack       = require("webpack");


const showError = function(err) {
    //console.log(err);

    notifier.notify({
        title: "Error in sass",
        message: err.messageFormatted
    });

    console.log(colors.red("==============================="));
    console.log(colors.red(err.messageFormatted));
    console.log(colors.red("==============================="));
}

const server = function(cb) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        notify: false,
        //host: "192.168.0.24",
        //port: 3000,
        open: true,
        //browser: "google chrome"
    });

    cb();
}

const css = function() {
    return gulp.src("src/scss/style.scss")
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle : "compressed"
            }).on("error", showError)
        )
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: ".min",
            basename: "style"
        }))
        .pipe(csso())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/css")) //tu nie ma średnika!
        .pipe(browserSync.stream({match: "**/*.css"}));
}

const js = function(cb) { //https://github.com/webpack/docs/wiki/usage-with-gulp#normal-compilation
    return webpack(require("./webpack.config.js"), function(err, stats) {
        if (err) throw err;
        console.log(stats.toString());
        browserSync.reload();
        cb();
    })
}

const watch = function() {
    gulp.watch("src/scss/**/*.scss", gulp.series(css));
    gulp.watch("src/js/**/*.js", gulp.series(js));
    gulp.watch("dist/**/*.html").on("change", browserSync.reload);
}

const startText = function(cb) {
    console.log(colors.yellow(`
        ───▄▀▀▀▄▄▄▄▄▄▄▀▀▀▄───
        ───█▒▒░░░░░░░░░▒▒█───
        ────█░░█░░░░░█░░█────
        ─▄▄──█░░░▀█▀░░░█──▄▄─
        █░░█─▀▄░░░░░░░▄▀─█░░█
    `));
    console.log(colors.blue('Start :)'))
    cb();
}

exports.default = gulp.series(startText, css, js, server, watch);
exports.css = css;
exports.watch = watch;
exports.js = js;