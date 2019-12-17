const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const browserify = require('browserify');
const watchPath = require('gulp-watch-path');
const gutil = require('gulp-util');
const combiner = require('stream-combiner2');
const sourcemaps = require('gulp-sourcemaps');
const cleancss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');

// error handler
const handleError = function (err) {
    const colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log('fileName: ' + colors.red(err.fileName));
    gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + colors.yellow(err.plugin));
};
// watch js
gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        const paths = watchPath(event, 'src/js/', 'dist/js/');
        /*
        paths
            { srcPath: 'src/js/log.js',
              srcDir: 'src/js/',
              distPath: 'dist/js/log.js',
              distDir: 'dist/js/',
              srcFilename: 'log.js',
              distFilename: 'log.js' }
        */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist: ' + paths.distDir);

        const combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            uglify(),
            // browserify(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ]);
        combined.on('error', handleError);

    });
});
// uglify js
gulp.task('uglifyjs', function () {
    var combined = combiner.obj([
        gulp.src('src/js/index.js'),
        babel({
            presets: [
                ["env", {
                  "modules": false,
                  "targets": {
                    "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
                  }
                }],
                "stage-2"
              ],
              "plugins": ["transform-runtime", "transform-es2015-modules-commonjs"]            
        }),
        browserify(),
        uglify(),
        // sourcemaps.write('./'),
        gulp.dest('dist/js/')
    ]);
    combined.on('error', handleError)
});
// browserify
// gulp.task("browserify", function () {
//     var b = browserify({
//         entries: "dist/js/index.js"
//     });
//     return b.bundle()
//         .pipe(source("index.js"))
//         .pipe(gulp.dest("dist/js"));
// });
// watch sass
gulp.task('watchscss', function () {
    gulp.watch('src/scss/**/*.scss', function (event) {
        const paths = watchPath(event, 'src/scss/', 'dist/css/');
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist: ' + paths.distDir);
        paths.srcPath = 'src/scss/**/style.scss';
        //    if(paths.srcPath !== 'src\\scss\\style.scss') return false;
        const combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            autoprefixer({
                browsers: 'last 2 versions'
            }),
            sass(),
            cleancss(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ]);
        combined.on('error', handleError);
    });
});
// sass
gulp.task('scsscss', function () {
    const combined = combiner.obj([
        gulp.src('src/scss/**/style.scss'),
        sourcemaps.init(),
        autoprefixer({
            browsers: 'last 2 versions'
        }),
        sass(),
        cleancss(),
        sourcemaps.write('./'),
        gulp.dest('dist/css')

    ]);
    combined.on('error', handleError);
});
// watch image
gulp.task('watchimage', function () {
    gulp.watch('src/images/**/*', function (event) {
        const paths = watchPath(event, 'src/images', 'dist/images');
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);
        const combined = combiner.obj([
            gulp.src(paths.srcPath),
            imagemin({
                progressive: true
            }),
            gulp.dest(paths.distDir)
        ]);
        combined.on('error', handleError);
    });
});
// imagemin
gulp.task('imagemin', function () {
    const combined = combiner.obj([
        gulp.src('src/images/**/*'),
        imagemin({
            progressive: true
        }),
        gulp.dest('dist/images/')
    ]);
    combined.on('error', handleError);
});
// watch html min
gulp.task('watchhtml', function () {
    gulp.watch('src/**/*.html', function (event) {
        const paths = watchPath(event, 'src/', 'dist/');
        gutil.log(gutil.colors.green(event.type + ' ' + paths.srcPath));
        gutil.log('Dist ' + paths.distPath);
        const options = {
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        };
        const combined = combiner.obj([
            gulp.src(paths.srcPath),
            htmlmin(options),
            gulp.dest(paths.distDir)
        ]);
        combined.on('error', handleError);
    });
});
// htmlmin
gulp.task('htmlmin', function () {
    const options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src('src/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/'));
});

// watch copy
gulp.task('watchcopy', function () {
    gulp.watch('src/fonts/**/*', function (event) {
        var paths = watchPath(event, 'src/', 'dist/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(gulp.dest(paths.distDir));
    })
});
// copy fonts
gulp.task('copy', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'));
});

// default task
gulp.task('default', [
    // build
    'uglifyjs', 'scsscss', 'imagemin', 'copy', 'htmlmin',
    // watch
    'watchjs', 'watchscss', 'watchimage', 'watchcopy', 'watchhtml'
]);

// live server
gulp.task('server', ['default'], function () {
    browserSync({
        server: {
            baseDir: ['dist'],
            port: 3000
        },
    }, function (err, bs) {
        console.log(bs.options.getIn(["urls", "local"]));
    });
    gulp.watch(['dist/**/*.*', 'dist/*.html'], browserSync.reload);
});