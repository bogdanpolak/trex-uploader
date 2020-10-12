'use strict';

// https://gist.github.com/jeromecoupe/0b807b0c1050647eb340360902c3203a

const gulp = require('gulp'),
    gulpmocha = require('gulp-mocha'),
    gutil = require('gulp-util');

function mocha () {
    return gulp.src(['tests/*.js'], {read: false})
        .pipe(gulpmocha({reporter: 'list'}))
        .on('error', gutil.log);
};

function watchFiles() {
    gulp.watch(['src/**/*.js', 'tests/**/*.js'], mocha);
};

const watch = gulp.series(watchFiles);

exports.mocha = mocha;
exports.watch = watch;